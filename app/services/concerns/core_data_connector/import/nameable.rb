module CoreDataConnector
  module Import
    module Nameable
      extend ActiveSupport::Concern

      NAME_DELIMITER = ';'

      included do

        def transform_names
          execute <<-SQL.squish
            WITH 
  
            record_names AS (
  
            SELECT id, ARRAY(SELECT trim(BOTH ' ' FROM unnest(string_to_array(name, '#{NAME_DELIMITER}')))) as names
              FROM #{table_name}
  
            )
  
            UPDATE #{table_name} z_table
               SET primary_name = record_names.names[1],
                   additional_names = record_names.names[2:array_length(record_names.names, 1)]
              FROM record_names
             WHERE record_names.id = z_table.id
          SQL
        end

      end
    end
  end
end