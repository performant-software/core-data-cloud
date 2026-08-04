module CoreDataConnector
  module Import
    class MediaContent < Base

      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_media_contents
             SET z_media_content_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_media_contents
        SQL
      end

      def load
        super

        execute <<-SQL.squish
         UPDATE core_data_connector_media_contents media_contents
            SET z_media_content_id = z_media_contents.id,
                name = z_media_contents.name,
                import_url = z_media_contents.import_url,
                content_warning = COALESCE(z_media_contents.content_warning, FALSE),
                import_url_processed = z_media_contents.import_url_processed,
                user_defined = z_media_contents.user_defined,
                import_id = z_media_contents.import_id,
                updated_at = current_timestamp
           FROM #{table_name} z_media_contents
          WHERE z_media_contents.media_content_id = media_contents.id
        SQL

        execute <<-SQL.squish
          WITH

          insert_media_contents AS (

          INSERT INTO core_data_connector_media_contents (
            project_model_id,
            uuid,
            z_media_content_id,
            name,
            import_url,
            content_warning,
            user_defined,
            import_id,
            created_at, 
            updated_at
          )
          SELECT z_media_contents.project_model_id,
                 z_media_contents.uuid,
                 z_media_contents.id,
                 z_media_contents.name,
                 z_media_contents.import_url,
                 COALESCE(z_media_contents.content_warning, FALSE),
                 z_media_contents.user_defined,
                 z_media_contents.import_id,
                 current_timestamp,
                 current_timestamp
            FROM #{table_name} z_media_contents
           WHERE z_media_contents.media_content_id IS NULL
          RETURNING id AS media_content_id, z_media_content_id

          )

          UPDATE #{table_name} z_media_contents
             SET media_content_id = insert_media_contents.media_content_id
            FROM insert_media_contents
           WHERE insert_media_contents.z_media_content_id = z_media_contents.id
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_media_contents
             SET media_content_id = media_contents.id,
                 user_defined = media_contents.user_defined
            FROM core_data_connector_media_contents media_contents
           WHERE media_contents.uuid = z_media_contents.uuid
             AND z_media_contents.uuid IS NOT NULL
        SQL

        execute <<-SQL.squish
          UPDATE #{table_name} z_media_contents
             SET import_url_processed = true
            FROM core_data_connector_media_contents media_contents
           WHERE media_contents.uuid = z_media_contents.uuid
             AND media_contents.import_url = z_media_contents.import_url
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
           name: 'import_url',
           type: 'VARCHAR',
           copy: true
         }, {
          name: 'content_warning',
          type: 'BOOLEAN',
          copy: true
         }, {
           name: 'media_content_id',
           type: 'INTEGER'
         }, {
           name: 'import_url_processed',
           type: 'BOOLEAN',
           options: 'NOT NULL DEFAULT FALSE'
         }, {
           name: 'user_defined',
           type: 'JSONB'
         }, {
           name: 'import_id',
           type: 'UUID'
         }]
      end

      def table_name_prefix
        'z_media_contents'
      end

    end
  end
end