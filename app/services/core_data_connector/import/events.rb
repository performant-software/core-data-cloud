module CoreDataConnector
  module Import
    class Events < Base
      DATE_FORMAT = 'YYYY-MM-DD'

      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_events
             SET z_event_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_events
        SQL
      end

      def load
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_events events
             SET z_event_id = z_events.id,
                 name = z_events.name,
                 description = z_events.description,
                 user_defined = z_events.user_defined,
                 import_id = z_events.import_id,
                 updated_at = current_timestamp
            FROM #{table_name} z_events
           WHERE z_events.event_id = events.id
        SQL

        execute <<-SQL.squish
          UPDATE fuzzy_dates_fuzzy_dates fuzzy_dates
             SET accuracy = #{FuzzyDates::FuzzyDate.accuracies['date']},
                 range = FALSE,
                 start_date = z_events.start_date_start_date,
                 end_date = z_events.start_date_end_date,
                 description = z_events.start_date_description,
                 updated_at = CURRENT_TIMESTAMP
            FROM #{table_name} z_events
           WHERE fuzzy_dates.dateable_id = z_events.event_id
             AND fuzzy_dates.dateable_type = 'CoreDataConnector::Event'
             AND fuzzy_dates.attribute_name = 'start_date'
        SQL

        execute <<-SQL.squish
          UPDATE fuzzy_dates_fuzzy_dates fuzzy_dates
             SET accuracy = #{FuzzyDates::FuzzyDate.accuracies['date']},
                 range = FALSE,
                 start_date = z_events.end_date_start_date,
                 end_date = z_events.end_date_end_date,
                 description = z_events.end_date_description,
                 updated_at = CURRENT_TIMESTAMP
            FROM #{table_name} z_events
           WHERE fuzzy_dates.dateable_id = z_events.event_id
             AND fuzzy_dates.dateable_type = 'CoreDataConnector::Event'
             AND fuzzy_dates.attribute_name = 'end_date'
        SQL

        execute <<-SQL.squish
          WITH 
          
          insert_events AS (

          INSERT INTO core_data_connector_events (
            project_model_id, 
            uuid, 
            z_event_id, 
            name, 
            description, 
            user_defined,
            import_id,
            created_at, 
            updated_at
          )
          SELECT z_events.project_model_id, 
                 z_events.uuid, 
                 z_events.id, 
                 z_events.name, 
                 z_events.description, 
                 z_events.user_defined,
                 z_events.import_id,
                 current_timestamp, 
                 current_timestamp
            FROM #{table_name} z_events
           WHERE z_events.event_id IS NULL
          RETURNING id AS event_id, z_event_id

          ),

          insert_start_date AS (

          INSERT INTO fuzzy_dates_fuzzy_dates (
            dateable_id, 
            dateable_type, 
            attribute_name, 
            accuracy, 
            range, 
            start_date, 
            end_date, 
            description, 
            created_at, 
            updated_at
          )
          SELECT insert_events.event_id,
                 'CoreDataConnector::Event',
                 'start_date',
                  #{FuzzyDates::FuzzyDate::accuracies['date']},
                  false,
                  z_events.start_date_start_date,
                  z_events.start_date_end_date,
                  z_events.start_date_description,
                  CURRENT_TIMESTAMP,
                  CURRENT_TIMESTAMP
            FROM insert_events
            JOIN #{table_name} z_events ON z_events.id = insert_events.z_event_id

          ),

          insert_end_date AS (

          INSERT INTO fuzzy_dates_fuzzy_dates (
            dateable_id, 
            dateable_type, 
            attribute_name, 
            accuracy, 
            range, 
            start_date, 
            end_date, 
            description, 
            created_at, 
            updated_at
          )
          SELECT insert_events.event_id,
                 'CoreDataConnector::Event',
                 'end_date',
                  #{FuzzyDates::FuzzyDate::accuracies['date']},
                  false,
                  z_events.end_date_start_date,
                  z_events.end_date_end_date,
                  z_events.end_date_description,
                  CURRENT_TIMESTAMP,
                  CURRENT_TIMESTAMP
            FROM insert_events
            JOIN #{table_name} z_events ON z_events.id = insert_events.z_event_id

          )

          UPDATE #{table_name} z_events
             SET event_id = insert_events.event_id
            FROM insert_events
           WHERE insert_events.z_event_id = z_events.id
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_events
             SET event_id = events.id,
                 user_defined = events.user_defined
            FROM core_data_connector_events events
           WHERE events.uuid = z_events.uuid
             AND z_events.uuid IS NOT NULL
        SQL

        super

        execute <<-SQL.squish
          UPDATE #{table_name} z_events
             SET start_date_start_date = TO_DATE(z_events.start_date, '#{DATE_FORMAT}'),
                 end_date_start_date = TO_DATE(z_events.end_date, '#{DATE_FORMAT}')
        SQL

        execute <<-SQL.squish
          UPDATE #{table_name} z_events
             SET start_date_end_date = z_events.start_date_start_date + INTERVAL '1 day',
                 end_date_end_date = z_events.end_date_start_date + INTERVAL '1 day'
        SQL
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
           name: 'description',
           type: 'TEXT',
           copy: true
         }, {
           name: 'start_date',
           type: 'VARCHAR',
           copy: true
         }, {
           name: 'start_date_description',
           type: 'VARCHAR',
           copy: true
         }, {
           name: 'end_date',
           type: 'VARCHAR',
           copy: true
         }, {
           name: 'end_date_description',
           type: 'VARCHAR',
           copy: true
         }, {
           name: 'event_id',
           type: 'INTEGER'
         }, {
           name: 'user_defined',
           type: 'JSONB'
         }, {
           name: 'start_date_start_date',
           type: 'DATE'
         }, {
           name: 'start_date_end_date',
           type: 'DATE'
         }, {
           name: 'end_date_start_date',
           type: 'DATE'
         }, {
           name: 'end_date_end_date',
           type: 'DATE'
         }, {
           name: 'import_id',
           type: 'UUID'
         }]
      end

      def table_name_prefix
        'z_events'
      end
    end
  end
end