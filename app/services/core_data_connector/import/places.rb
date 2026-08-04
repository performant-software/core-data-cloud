module CoreDataConnector
  module Import
    class Places < Base
      # Includes
      include Nameable

      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_places
             SET z_place_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_places, 
                         core_data_connector_place_names, 
                         core_data_connector_place_geometries
        SQL
      end

      def load
        super

        # Update existing places
        execute <<-SQL.squish
          WITH
              
          update_places AS (
          
          UPDATE core_data_connector_places places
             SET z_place_id = z_places.id,
                 user_defined = z_places.user_defined,
                 import_id = z_places.import_id,
                 updated_at = current_timestamp
            FROM #{table_name} z_places
           WHERE z_places.place_id = places.id
              
          )

          UPDATE core_data_connector_place_geometries place_geometries
             SET geometry = st_makepoint(z_places.longitude, z_places.latitude),
                 properties = z_places.properties,
                 updated_at = current_timestamp
            FROM #{table_name} z_places
           WHERE z_places.place_id = place_geometries.place_id
        SQL

        # Insert new places
        execute <<-SQL.squish
          WITH 

          insert_places AS (

          INSERT INTO core_data_connector_places (
            project_model_id,
            uuid,
            z_place_id, 
            user_defined,
            import_id,
            created_at,
            updated_at
          )
          SELECT z_places.project_model_id,
                 z_places.uuid,
                 z_places.id,
                 z_places.user_defined,
                 z_places.import_id,
                 current_timestamp,
                 current_timestamp
            FROM #{table_name} z_places
           WHERE z_places.place_id IS NULL
          RETURNING id AS place_id, z_place_id

          ),

          insert_place_geometries AS (

          INSERT INTO core_data_connector_place_geometries (place_id, geometry, properties, created_at, updated_at)
          SELECT insert_places.place_id, st_makepoint(z_places.longitude, z_places.latitude), z_places.properties, current_timestamp, current_timestamp
            FROM insert_places
            JOIN #{table_name} z_places ON z_places.id = insert_places.z_place_id
          RETURNING id

          )

          UPDATE #{table_name} z_places
             SET place_id = insert_places.place_id
            FROM insert_places
           WHERE insert_places.z_place_id = z_places.id
        SQL

        # Insert new place_names
        execute <<-SQL.squish
          WITH 
 
          all_place_names AS (
            
          SELECT z_places.place_id AS place_id, z_places.primary_name AS name
            FROM #{table_name} z_places
           UNION ALL
          SELECT z_places.place_id AS place_id, unnest(z_places.additional_names) AS name
            FROM #{table_name} z_places
          
          )

          INSERT INTO core_data_connector_place_names (place_id, name, created_at, updated_at)
          SELECT all_place_names.place_id, all_place_names.name, current_timestamp, current_timestamp
            FROM all_place_names
           WHERE NOT EXISTS ( SELECT 1
                                FROM core_data_connector_place_names place_names
                               WHERE place_names.place_id = all_place_names.place_id
                                 AND place_names.name = all_place_names.name )
        SQL

        # Reset all place_names "primary" indicator to FALSE
        execute <<-SQL.squish
          UPDATE core_data_connector_place_names place_names
             SET "primary" = FALSE,
                 updated_at = current_timestamp
            FROM #{table_name} z_places
           WHERE z_places.place_id = place_names.place_id
        SQL

        # Set place_names "primary" indicator to TRUE
        execute <<-SQL.squish
          WITH 
              
          primary_place_names AS (
              
          SELECT z_places.place_id AS place_id, z_places.primary_name AS name
            FROM #{table_name} z_places

          )

          UPDATE core_data_connector_place_names place_names
             SET "primary" = TRUE,
                 updated_at = current_timestamp
            FROM primary_place_names
           WHERE primary_place_names.place_id = place_names.place_id
             AND primary_place_names.name = place_names.name
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_places
             SET place_id = places.id,
                 user_defined = places.user_defined,
                 properties = COALESCE(z_places.properties, place_geometries.properties, '{}'::jsonb)
            FROM core_data_connector_places places
            LEFT JOIN core_data_connector_place_geometries place_geometries ON place_geometries.place_id = places.id
           WHERE places.uuid = z_places.uuid
             AND z_places.uuid IS NOT NULL
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
           name: 'latitude',
           type: 'DECIMAL',
           copy: true
         }, {
           name: 'longitude',
           type: 'DECIMAL',
           copy: true
         }, {
          name: 'properties',
          type: 'JSONB',
          copy: @csv_headers.include?('properties')
        }, {
           name: 'place_id',
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
        'z_places'
      end
    end
  end
end