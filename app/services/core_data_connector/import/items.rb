module CoreDataConnector
  module Import
    class Items < Base
      # Includes
      include Nameable

      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_items
             SET z_item_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_items, core_data_connector_source_names
        SQL
      end

      def load
        super

        # Update existing items
        execute <<-SQL.squish
          UPDATE core_data_connector_items items
             SET z_item_id = z_items.id,
                 user_defined = z_items.user_defined,
                 import_id = z_items.import_id,
                 updated_at = current_timestamp
            FROM #{table_name} z_items
           WHERE z_items.item_id = items.id
        SQL

        # Insert new items
        execute <<-SQL.squish
          WITH
  
          insert_items AS (
  
          INSERT INTO core_data_connector_items (
            project_model_id,
            uuid,
            z_item_id,
            user_defined,
            import_id,
            created_at,
            updated_at
          )
          SELECT z_items.project_model_id,
                 z_items.uuid,
                 z_items.id,
                 z_items.user_defined,
                 z_items.import_id,
                 current_timestamp,
                 current_timestamp
            FROM #{table_name} z_items
           WHERE z_items.item_id IS NULL
          RETURNING id AS item_id, z_item_id
  
          )
  
          UPDATE #{table_name} z_items
             SET item_id = insert_items.item_id
            FROM insert_items
           WHERE insert_items.z_item_id = z_items.id
        SQL

        # Insert new source_names
        execute <<-SQL.squish
          WITH 
  
          all_item_names AS (
            
          SELECT z_items.item_id AS item_id, z_items.primary_name AS name
            FROM #{table_name} z_items
           UNION ALL
          SELECT z_items.item_id AS item_id, unnest(z_items.additional_names) AS name
            FROM #{table_name} z_items
          
          )
  
          INSERT INTO core_data_connector_source_names (
            nameable_id, 
            nameable_type, 
            name, 
            created_at, 
            updated_at
          )
          SELECT all_item_names.item_id, 
                 'CoreDataConnector::Item', 
                 all_item_names.name, 
                 current_timestamp, 
                 current_timestamp
            FROM all_item_names
           WHERE NOT EXISTS ( SELECT 1
                                FROM core_data_connector_source_names source_names
                               WHERE source_names.nameable_id = all_item_names.item_id
                                 AND source_names.nameable_type = 'CoreDataConnector::Item'
                                 AND source_names.name = all_item_names.name )
        SQL

        # Reset "primary" indicator for all source_names to FALSE
        execute <<-SQL.squish
          UPDATE core_data_connector_source_names source_names
             SET "primary" = FALSE,
                 updated_at = current_timestamp
            FROM #{table_name} z_items
           WHERE z_items.item_id = source_names.nameable_id
             AND source_names.nameable_type = 'CoreDataConnector::Item'
        SQL

        # Set the "primary" indicator for source_names to TRUE
        execute <<-SQL.squish
          WITH 
                
          primary_item_names AS (
              
          SELECT z_items.item_id AS item_id, z_items.primary_name AS name
            FROM #{table_name} z_items
  
          )
  
          UPDATE core_data_connector_source_names source_names
             SET "primary" = TRUE,
                 updated_at = current_timestamp
            FROM primary_item_names
           WHERE primary_item_names.item_id = source_names.nameable_id
             AND primary_item_names.name = source_names.name
             AND source_names.nameable_type = 'CoreDataConnector::Item'
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_items
             SET item_id = items.id,
                 user_defined = items.user_defined
            FROM core_data_connector_items items
           WHERE items.uuid = z_items.uuid
             AND z_items.uuid IS NOT NULL
        SQL

        transform_names

        super
      end

      protected

      def column_names
        [{
          name: 'project_model_id',
          type: 'INTEGER',
          copy: true
        }, {
          name: 'uuid',
          type: 'UUID',
          copy: true
        }, {
          name: 'name',
          type: 'VARCHAR',
          copy: true
        }, {
          name: 'item_id',
          type: 'INTEGER'
        }, {
          name: 'primary_name',
          type: 'VARCHAR'
        }, {
          name: 'additional_names',
          type: 'TEXT[]'
        }, {
          name: 'user_defined',
          type: 'JSONB'
        }, {
          name: 'import_id',
          type: 'UUID'
        }]
      end

      def table_name_prefix
        'z_items'
      end
    end
  end
end
