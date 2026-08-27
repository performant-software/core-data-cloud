module CoreDataConnector
  module Import
    class Instances < Base
      # Includes
      include Nameable

      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_instances
             SET z_instance_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_instances, core_data_connector_source_names
        SQL
      end

      def load
        super

        # Snapshot the instances about to be updated
        audit_updates(
          CoreDataConnector::Instance,
          from: <<-SQL.squish
            FROM #{table_name} z_instances
            JOIN core_data_connector_instances records ON records.id = z_instances.instance_id
          SQL
        )

        # Update existing instances
        execute <<-SQL.squish
          UPDATE core_data_connector_instances instances
             SET z_instance_id = z_instances.id,
                 user_defined = z_instances.user_defined,
                 import_id = z_instances.import_id,
                 updated_at = current_timestamp
            FROM #{table_name} z_instances
           WHERE z_instances.instance_id = instances.id
        SQL

        # Insert new instances
        execute <<-SQL.squish
          WITH
  
          insert_instances AS (
  
          INSERT INTO core_data_connector_instances (
            project_model_id,
            uuid,
            z_instance_id,
            user_defined,
            import_id,
            published,
            created_at,
            updated_at
          )
          SELECT z_instances.project_model_id,
                 z_instances.uuid,
                 z_instances.id,
                 z_instances.user_defined,
                 z_instances.import_id,
                 #{default_to_published('z_instances')},
                 current_timestamp,
                 current_timestamp
            FROM #{table_name} z_instances
           WHERE z_instances.instance_id IS NULL
          RETURNING id AS instance_id, z_instance_id

          ),

          update_instances AS (

          UPDATE #{table_name} z_instances
             SET instance_id = insert_instances.instance_id
            FROM insert_instances
           WHERE insert_instances.z_instance_id = z_instances.id

          )

          INSERT INTO #{audit_table} (item_type, item_id, event, root_type, root_id)
          SELECT 'CoreDataConnector::Instance',
                 insert_instances.instance_id,
                 'create',
                 'CoreDataConnector::Instance',
                 insert_instances.instance_id
            FROM insert_instances
        SQL

        # Insert new source_names
        execute <<-SQL.squish
          WITH 
  
          all_instance_names AS (
            
          SELECT z_instances.instance_id AS instance_id, z_instances.primary_name AS name
            FROM #{table_name} z_instances
           UNION ALL
          SELECT z_instances.instance_id AS instance_id, unnest(z_instances.additional_names) AS name
            FROM #{table_name} z_instances
          
          ),

          insert_instance_names AS (

          INSERT INTO core_data_connector_source_names (
            nameable_id,
            nameable_type,
            name,
            created_at,
            updated_at
          )
          SELECT all_instance_names.instance_id,
                 'CoreDataConnector::Instance',
                 all_instance_names.name,
                 current_timestamp,
                 current_timestamp
            FROM all_instance_names
           WHERE NOT EXISTS ( SELECT 1
                                FROM core_data_connector_source_names source_names
                               WHERE source_names.nameable_id = all_instance_names.instance_id
                                 AND source_names.nameable_type = 'CoreDataConnector::Instance'
                                 AND source_names.name = all_instance_names.name )
          RETURNING id AS source_name_id, nameable_id

          )

          INSERT INTO #{audit_table} (item_type, item_id, event, root_type, root_id)
          SELECT 'CoreDataConnector::SourceName',
                 insert_instance_names.source_name_id,
                 'create',
                 'CoreDataConnector::Instance',
                 insert_instance_names.nameable_id
            FROM insert_instance_names
        SQL

        # Snapshot the source_names about to have their "primary" indicator reset
        audit_updates(
          CoreDataConnector::SourceName,
          root_type: "'CoreDataConnector::Instance'",
          root_id: 'records.nameable_id',
          from: <<-SQL.squish
            FROM #{table_name} z_instances
            JOIN core_data_connector_source_names records ON records.nameable_id = z_instances.instance_id
                                                         AND records.nameable_type = 'CoreDataConnector::Instance'
          SQL
        )

        # Reset "primary" indicator for all source_names to FALSE
        execute <<-SQL.squish
          UPDATE core_data_connector_source_names source_names
             SET "primary" = FALSE,
                 updated_at = current_timestamp
            FROM #{table_name} z_instances
           WHERE z_instances.instance_id = source_names.nameable_id
             AND source_names.nameable_type = 'CoreDataConnector::Instance'
        SQL

        # Set the "primary" indicator for source_names to TRUE
        execute <<-SQL.squish
          WITH 
                
          primary_instance_names AS (
              
          SELECT z_instances.instance_id AS instance_id, z_instances.primary_name AS name
            FROM #{table_name} z_instances
  
          )
  
          UPDATE core_data_connector_source_names source_names
             SET "primary" = TRUE,
                 updated_at = current_timestamp
            FROM primary_instance_names
           WHERE primary_instance_names.instance_id = source_names.nameable_id
             AND primary_instance_names.name = source_names.name
             AND source_names.nameable_type = 'CoreDataConnector::Instance'
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_instances
             SET instance_id = instances.id,
                 user_defined = instances.user_defined
            FROM core_data_connector_instances instances
           WHERE instances.uuid = z_instances.uuid
             AND z_instances.uuid IS NOT NULL
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
          name: 'instance_id',
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
        'z_instances'
      end
    end
  end
end
