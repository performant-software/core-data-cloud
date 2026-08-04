module CoreDataConnector
  module Import
    class Taxonomies < Base
      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_taxonomies
             SET z_taxonomy_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_taxonomies
        SQL
      end

      def load
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_taxonomies taxonomies
            SET  z_taxonomy_id = z_taxonomies.id,
                 name = z_taxonomies.name,
                 user_defined = z_taxonomies.user_defined,
                 import_id = z_taxonomies.import_id,
                 updated_at = current_timestamp
           FROM #{table_name} z_taxonomies
          WHERE z_taxonomies.taxonomy_id = taxonomies.id
        SQL

        execute <<-SQL.squish
          WITH

          insert_taxonomies AS (

          INSERT INTO core_data_connector_taxonomies (
            project_model_id,
            uuid,
            z_taxonomy_id,
            name,
            user_defined,
            import_id,
            created_at, 
            updated_at
          )
          SELECT z_taxonomies.project_model_id,
                 z_taxonomies.uuid,
                 z_taxonomies.id,
                 z_taxonomies.name,
                 z_taxonomies.user_defined,
                 z_taxonomies.import_id,
                 current_timestamp,
                 current_timestamp
            FROM #{table_name} z_taxonomies
           WHERE z_taxonomies.taxonomy_id IS NULL
          RETURNING id AS taxonomy_id, z_taxonomy_id

          )

          UPDATE #{table_name} z_taxonomies
              SET taxonomy_id = insert_taxonomies.taxonomy_id
             FROM insert_taxonomies
            WHERE insert_taxonomies.z_taxonomy_id = z_taxonomies.id
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_taxonomies
             SET taxonomy_id = taxonomies.id,
                 user_defined = taxonomies.user_defined
            FROM core_data_connector_taxonomies taxonomies
           WHERE taxonomies.uuid = z_taxonomies.uuid
             AND z_taxonomies.uuid IS NOT NULL
        SQL

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
          name: 'taxonomy_id',
          type: 'INTEGER'
        }, {
          name: 'user_defined',
          type: 'JSONB'
        }, {
          name: 'import_id',
          type: 'UUID'
        }]
      end

      def table_name_prefix
        'z_taxonomies'
      end
    end
  end
end