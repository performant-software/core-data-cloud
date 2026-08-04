module CoreDataConnector
  module Import
    class People < Base
      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_people
             SET z_person_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_people, core_data_connector_person_names
        SQL
      end

      def load
        super

        # Update existing people
        execute <<-SQL.squish
          UPDATE core_data_connector_people people
             SET z_person_id = z_people.id,
                 biography = z_people.biography,
                 user_defined = z_people.user_defined,
                 import_id = z_people.import_id,
                 updated_at = current_timestamp
            FROM #{table_name} z_people
           WHERE z_people.person_id = people.id
        SQL

        # Insert new people
        execute <<-SQL.squish
          WITH 
          
          insert_people AS (

          INSERT INTO core_data_connector_people (
            project_model_id, 
            uuid, 
            z_person_id, 
            biography, 
            user_defined,
            import_id,
            created_at, 
            updated_at
          )
          SELECT z_people.project_model_id, 
                 z_people.uuid, 
                 z_people.id, 
                 z_people.biography, 
                 z_people.user_defined,
                 z_people.import_id,
                 current_timestamp, 
                 current_timestamp
            FROM #{table_name} z_people
           WHERE z_people.person_id IS NULL
          RETURNING id AS person_id, z_person_id

          )

          UPDATE #{table_name} z_people
             SET person_id = insert_people.person_id
            FROM insert_people
           WHERE insert_people.z_person_id = z_people.id
        SQL

        # Insert new person_names
        execute <<-SQL.squish
          WITH 
 
          all_person_names AS (
            
          SELECT z_people.person_id AS person_id, 
                 z_people.primary_last_name AS last_name,
                 z_people.primary_first_name AS first_name,
                 z_people.primary_middle_name AS middle_name
            FROM #{table_name} z_people
           UNION ALL
          SELECT z_people.person_id AS person_id, 
                 unnest(z_people.additional_last_names) AS last_name,
                 unnest(z_people.additional_first_names) AS first_name,
                 unnest(z_people.additional_middle_names) AS middle_name
            FROM #{table_name} z_people
          
          )

          INSERT INTO core_data_connector_person_names (
            person_id, 
            last_name,
            first_name,
            middle_name, 
            created_at, 
            updated_at
          )
          SELECT all_person_names.person_id, 
                 all_person_names.last_name,
                 all_person_names.first_name,
                 all_person_names.middle_name, 
                 current_timestamp, 
                 current_timestamp
            FROM all_person_names
           WHERE NOT EXISTS ( SELECT 1
                                FROM core_data_connector_person_names person_names
                               WHERE person_names.person_id = all_person_names.person_id
                                 AND ( person_names.last_name = all_person_names.last_name 
                                  OR ( person_names.last_name IS NULL AND all_person_names.last_name IS NULL ))
                                 AND ( person_names.first_name = all_person_names.first_name
                                  OR ( person_names.first_name IS NULL AND all_person_names.first_name IS NULL ))
                                 AND ( person_names.middle_name = all_person_names.middle_name 
                                  OR ( person_names.middle_name IS NULL AND all_person_names.middle_name IS NULL )))
        SQL

        # Reset all person_names "primary" indicator to FALSE
        execute <<-SQL.squish
          UPDATE core_data_connector_person_names person_names
             SET "primary" = FALSE,
                 updated_at = current_timestamp
            FROM #{table_name} z_people
           WHERE z_people.person_id = person_names.person_id
        SQL

        # Set person_names "primary" indicator to TRUE
        execute <<-SQL.squish
          WITH 
              
          primary_person_names AS (
              
          SELECT z_people.person_id AS person_id, 
                 z_people.primary_last_name AS last_name,
                 z_people.primary_first_name AS first_name,
                 z_people.primary_middle_name AS middle_name
            FROM #{table_name} z_people

          )

          UPDATE core_data_connector_person_names person_names
             SET "primary" = TRUE,
                 updated_at = current_timestamp
            FROM primary_person_names
           WHERE primary_person_names.person_id = person_names.person_id
             AND ( person_names.last_name = primary_person_names.last_name 
              OR ( person_names.last_name IS NULL AND primary_person_names.last_name IS NULL ))
             AND ( person_names.first_name = primary_person_names.first_name
              OR ( person_names.first_name IS NULL AND primary_person_names.first_name IS NULL ))
             AND ( person_names.middle_name = primary_person_names.middle_name 
              OR ( person_names.middle_name IS NULL AND primary_person_names.middle_name IS NULL ))
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_people
             SET person_id = people.id,
                 user_defined = people.user_defined
            FROM core_data_connector_people people
           WHERE people.uuid = z_people.uuid
             AND z_people.uuid IS NOT NULL
        SQL

        execute <<-SQL.squish
          WITH 

          record_names AS (

          SELECT id, 
                 ARRAY(SELECT nullif(trim(BOTH ' ' FROM unnest(string_to_array(last_name, '#{Nameable::NAME_DELIMITER}'))), '')) as last_names,
                 ARRAY(SELECT nullif(trim(BOTH ' ' FROM unnest(string_to_array(first_name, '#{Nameable::NAME_DELIMITER}'))), '')) as first_names,
                 ARRAY(SELECT nullif(trim(BOTH ' ' FROM unnest(string_to_array(middle_name, '#{Nameable::NAME_DELIMITER}'))), '')) as middle_names
            FROM #{table_name}

          )

          UPDATE #{table_name} z_people
             SET primary_last_name = record_names.last_names[1],
                 primary_first_name = record_names.first_names[1],
                 primary_middle_name = record_names.middle_names[1],
                 additional_last_names = record_names.last_names[2:array_length(record_names.last_names, 1)],
                 additional_first_names = record_names.first_names[2:array_length(record_names.first_names, 1)],
                 additional_middle_names = record_names.middle_names[2:array_length(record_names.middle_names, 1)]
            FROM record_names
           WHERE record_names.id = z_people.id
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
           name: 'last_name',
           type: 'VARCHAR',
           copy: true
         }, {
           name: 'first_name',
           type: 'VARCHAR',
           copy: true
         }, {
           name: 'middle_name',
           type: 'VARCHAR',
           copy: true
         }, {
           name: 'biography',
           type: 'TEXT',
           copy: true
         }, {
           name: 'person_id',
           type: 'INTEGER'
         }, {
           name: 'primary_last_name',
           type: 'VARCHAR'
         }, {
           name: 'primary_first_name',
           type: 'VARCHAR'
         }, {
           name: 'primary_middle_name',
           type: 'VARCHAR'
         }, {
           name: 'additional_last_names',
           type: 'TEXT[]'
         }, {
           name: 'additional_first_names',
           type: 'TEXT[]'
         }, {
           name: 'additional_middle_names',
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
        'z_people'
      end
    end
  end
end