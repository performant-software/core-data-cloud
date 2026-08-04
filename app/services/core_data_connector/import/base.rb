require 'csv'

module CoreDataConnector
  module Import
    class Base
      attr_reader :filepath, :import_id, :table_name, :user_defined_columns

      def initialize(filepath, import_id)
        @filepath = filepath
        @import_id = import_id

        @connection = ActiveRecord::Base.connection
        @csv_headers = CSV.foreach(filepath).first
        @table_name = create_table_name
        @user_defined_columns = load_user_defined_columns
      end

      def cleanup
        execute <<-SQL.squish
          DROP TABLE IF EXISTS #{table_name}
        SQL
      end

      def extract
        column_names = columns
                         .select{ |c| c[:copy] == true }
                         .map{ |column| column[:name] }.join(', ')

        options = "FORMAT CSV, DELIMITER ','"
        copy_command = "COPY #{table_name} (#{column_names}) FROM STDIN WITH (#{options})"

        @connection.raw_connection.copy_data(copy_command)  do
          CSV.foreach(filepath, headers: true) do |row|
            @connection.raw_connection.put_copy_data(row.to_csv)
          end
        end
      end

      def load
        # Implemented in sub-classes
      end

      def setup
        column_names = columns
                         .map{ |column| "#{column[:name]} #{column[:type]} #{column[:options]}" }
                         .join(', ')

        execute <<-SQL.squish
          CREATE TABLE #{table_name} (
            id SERIAL,
            #{column_names}
          )
        SQL
      end

      def transform
        # Set the uuid value for any NULL records
        execute <<-SQL.squish
          UPDATE #{table_name}
             SET uuid = gen_random_uuid()
           WHERE uuid IS NULL
        SQL

        # Set the import_id value for each record
        execute <<-SQL.squish
          UPDATE #{table_name}
             SET import_id = '#{import_id}'
        SQL

        return unless user_defined_columns.present?

        # Sets the user_defined column based on any included user-defined fields
        all_udc_args = user_defined_columns
                     .map{ |c| ["'#{c[:uuid]}'", c[:name]] }
                     .flatten
        # can't pass more than 100 arguments to a function, so build
        # expression using multiple function calls, each <= 100 args
        expressions = []
        all_udc_args.each_slice(100) do |udc_arg_set|
          args = udc_arg_set.join(', ')
          expressions.push("jsonb_strip_nulls(jsonb_build_object(#{args}))")
        end
        expression = expressions.join(' || ')

        execute <<-SQL.squish
          UPDATE #{table_name}
             SET user_defined = COALESCE(user_defined, '{}') || #{expression}
        SQL

        # Sets the "Select" and "FuzzyDate" user-defined types to JSONB
        user_defined_columns.each do |column|
          next unless column[:data_type] == UserDefinedFields::UserDefinedField::DATA_TYPES[:select] && column[:allow_multiple] ||
            column[:data_type] == UserDefinedFields::UserDefinedField::DATA_TYPES[:fuzzy_date]

          execute <<-SQL.squish
            UPDATE #{table_name}
               SET user_defined = jsonb_set(user_defined, '{#{column[:uuid]}}', (user_defined->>'#{column[:uuid]}')::jsonb)
             WHERE user_defined->>'#{column[:uuid]}' IS NOT NULL
               AND user_defined->>'#{column[:uuid]}' != ''
          SQL
        end
      end

      protected

      def execute(sql)
        @connection.execute sql
      end

      def table_name_prefix
        # Implemented in sub-classes
      end

      private

      def columns
        [ *column_names, *user_defined_columns ]
      end

      def create_table_name
        "#{table_name_prefix}_#{Random.rand(1000..9999)}"
      end

      def load_user_defined_columns
        columns = []

        @csv_headers.each do |header|
          next unless ImportAnalyze::Helper.is_user_defined_column?(header)

          uuid = ImportAnalyze::Helper.column_name_to_uuid(header)
          user_defined_field = UserDefinedFields::UserDefinedField.find_by_uuid(uuid)

          data_type = user_defined_field.data_type
          allow_multiple = user_defined_field.allow_multiple

          columns << {
            name: header,
            type: 'VARCHAR',
            uuid: uuid,
            data_type: data_type,
            allow_multiple: allow_multiple,
            copy: true
          }
        end

        columns
      end

      # Converts the passed UUID value to a database-safe column name
      def uuid_to_column_name(uuid)
        "_#{uuid.gsub('-', '_')}"
      end
    end
  end
end
