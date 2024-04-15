# frozen_string_literal: true

# This migration comes from user_defined_fields (originally 20230920142719)
class ConvertUserDefinedFieldsKeysToUuid < ActiveRecord::Migration[7.0]
  def up
    results = execute <<-SQL.squish
      SELECT DISTINCT(table_name) as table_name
        FROM user_defined_fields_user_defined_fields
    SQL

    results.to_a.each do |result|
      class_name = result['table_name']
      klass = class_name.constantize
      table_name = klass.table_name

      execute <<-SQL.squish
          WITH updated_keys AS (
        SELECT records.id AS id, jsonb_object_agg(udfs.uuid, records.user_defined->udfs.column_name) as user_defined
          FROM #{table_name} records, 
               user_defined_fields_user_defined_fields udfs
         WHERE udfs.table_name = '#{class_name}'
           AND records.user_defined->udfs.column_name IS NOT NULL
         GROUP BY records.id
       )
       UPDATE #{table_name} AS records
          SET user_defined = updated_keys.user_defined
         FROM updated_keys
        WHERE updated_keys.id = records.id
      SQL
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
