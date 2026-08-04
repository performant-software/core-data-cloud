module CoreDataConnector
  module Import
    class Works < Base
      # Includes
      include Nameable

      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_works
             SET z_work_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_works, core_data_connector_source_names
        SQL
      end

      def load
        super

        # Update existing works
        execute <<-SQL.squish
          UPDATE core_data_connector_works works
             SET z_work_id = z_works.id,
                 user_defined = z_works.user_defined,
                 import_id = z_works.import_id,
                 updated_at = current_timestamp
            FROM #{table_name} z_works
           WHERE z_works.work_id = works.id
        SQL

        # Insert new works
        execute <<-SQL.squish
          WITH
  
          insert_works AS (
  
          INSERT INTO core_data_connector_works (
            project_model_id,
            uuid,
            z_work_id,
            user_defined,
            import_id,
            created_at,
            updated_at
          )
          SELECT z_works.project_model_id,
                 z_works.uuid,
                 z_works.id,
                 z_works.user_defined,
                 z_works.import_id,
                 current_timestamp,
                 current_timestamp
            FROM #{table_name} z_works
           WHERE z_works.work_id IS NULL
          RETURNING id AS work_id, z_work_id
  
          )
  
          UPDATE #{table_name} z_works
             SET work_id = insert_works.work_id
            FROM insert_works
           WHERE insert_works.z_work_id = z_works.id
        SQL

        # Insert new source_names
        execute <<-SQL.squish
          WITH 
  
          all_work_names AS (
            
          SELECT z_works.work_id AS work_id, z_works.primary_name AS name
            FROM #{table_name} z_works
           UNION ALL
          SELECT z_works.work_id AS work_id, unnest(z_works.additional_names) AS name
            FROM #{table_name} z_works
          
          )
  
          INSERT INTO core_data_connector_source_names (
            nameable_id, 
            nameable_type, 
            name, 
            created_at, 
            updated_at
          )
          SELECT all_work_names.work_id, 
                 'CoreDataConnector::Work', 
                 all_work_names.name, 
                 current_timestamp, 
                 current_timestamp
            FROM all_work_names
           WHERE NOT EXISTS ( SELECT 1
                                FROM core_data_connector_source_names source_names
                               WHERE source_names.nameable_id = all_work_names.work_id
                                 AND source_names.nameable_type = 'CoreDataConnector::Work'
                                 AND source_names.name = all_work_names.name )
        SQL

        # Reset "primary" indicator for all source_names to FALSE
        execute <<-SQL.squish
          UPDATE core_data_connector_source_names source_names
             SET "primary" = FALSE,
                 updated_at = current_timestamp
            FROM #{table_name} z_works
           WHERE z_works.work_id = source_names.nameable_id
             AND source_names.nameable_type = 'CoreDataConnector::Work'
        SQL

        # Set the "primary" indicator for source_names to TRUE
        execute <<-SQL.squish
          WITH 
                
          primary_work_names AS (
              
          SELECT z_works.work_id AS work_id, z_works.primary_name AS name
            FROM #{table_name} z_works
  
          )
  
          UPDATE core_data_connector_source_names source_names
             SET "primary" = TRUE,
                 updated_at = current_timestamp
            FROM primary_work_names
           WHERE primary_work_names.work_id = source_names.nameable_id
             AND primary_work_names.name = source_names.name
             AND source_names.nameable_type = 'CoreDataConnector::Work'
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_works
             SET work_id = works.id,
                 user_defined = works.user_defined
            FROM core_data_connector_works works
           WHERE works.uuid = z_works.uuid
             AND z_works.uuid IS NOT NULL
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
          name: 'work_id',
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
        'z_works'
      end
    end
  end
end
