module CoreDataConnector
  module Import
    class WebIdentifiers < Base
      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_web_identifiers
            SET z_web_identifier_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_web_identifiers
        SQL
      end

      def load
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_web_identifiers web_identifiers
             SET z_web_identifier_id = z_web_identifiers.id,
                 updated_at = current_timestamp
            FROM #{table_name} z_web_identifiers
           WHERE z_web_identifiers.web_identifier_id = web_identifiers.id
        SQL

        execute <<-SQL.squish
          WITH

          insert_web_identifiers AS (

          INSERT INTO core_data_connector_web_identifiers (
            z_web_identifier_id,
            identifiable_id,
            identifiable_type,
            web_authority_id,
            identifier,
            created_at,
            updated_at
            )
          SELECT z_web_identifiers.id,
                 z_web_identifiers.identifiable_id,
                 z_web_identifiers.identifiable_type,
                 z_web_identifiers.web_authority_id,
                 z_web_identifiers.identifier,
                 current_timestamp,
                 current_timestamp
          FROM   #{table_name} z_web_identifiers
          WHERE  z_web_identifiers.web_identifier_id IS NULL
          RETURNING id AS web_identifier_id, z_web_identifier_id

          )

          UPDATE #{table_name} z_web_identifiers
             SET web_identifier_id = insert_web_identifiers.web_identifier_id
            FROM insert_web_identifiers
           WHERE insert_web_identifiers.z_web_identifier_id = z_web_identifiers.id
        SQL
      end

      def transform
        super

        execute <<-SQL.squish
          WITH
          
          related_types AS (
          SELECT id, uuid, 'CoreDataConnector::Event' AS type
            FROM core_data_connector_events events
           WHERE events.z_event_id IS NOT NULL
           UNION
          SELECT id, uuid, 'CoreDataConnector::Instance' AS type
            FROM core_data_connector_instances instances
           WHERE instances.z_instance_id IS NOT NULL
          UNION
          SELECT id, uuid, 'CoreDataConnector::Item' AS type
            FROM core_data_connector_items items
           WHERE items.z_item_id IS NOT NULL
          UNION
          SELECT id, uuid, 'CoreDataConnector::Organization' AS type
            FROM core_data_connector_organizations organizations
           WHERE organizations.z_organization_id IS NOT NULL
          UNION
          SELECT id, uuid, 'CoreDataConnector::Person' AS type
            FROM core_data_connector_people people
           WHERE people.z_person_id IS NOT NULL
          UNION
          SELECT id, uuid, 'CoreDataConnector::Place' AS type
            FROM core_data_connector_places places
           WHERE places.z_place_id IS NOT NULL
          UNION
          SELECT id, uuid, 'CoreDataConnector::Taxonomy' AS type
            FROM core_data_connector_taxonomies taxonomies
           WHERE taxonomies.z_taxonomy_id IS NOT NULL
          UNION
          SELECT id, uuid, 'CoreDataConnector::Work' AS type
            FROM core_data_connector_works works
           WHERE works.z_work_id IS NOT NULL

        )

        UPDATE #{table_name} z_web_identifiers
           SET identifiable_id = related_types.id
          FROM related_types
         WHERE related_types.uuid = z_web_identifiers.identifiable_uuid
           AND related_types.type = z_web_identifiers.identifiable_type
        SQL

        execute <<-SQL.squish
          UPDATE #{table_name} z_web_identifiers
             SET web_identifier_id = web_identifiers.id
            FROM core_data_connector_web_identifiers web_identifiers
           WHERE web_identifiers.identifiable_type = z_web_identifiers.identifiable_type
             AND web_identifiers.identifier = z_web_identifiers.identifier
             AND web_identifiers.web_authority_id = z_web_identifiers.web_authority_id
             AND web_identifiers.identifiable_id = z_web_identifiers.identifiable_id
        SQL

      end

      protected

      def column_names
        [{
          name: 'web_authority_id',
          type: 'INTEGER',
          copy: true
        }, {
          name: 'identifiable_uuid',
          type: 'UUID',
          copy: true
        }, {
          name: 'identifiable_type',
          type: 'VARCHAR',
          copy: true
        }, {
          name: 'identifier',
          type: 'VARCHAR',
          copy: true
        }, {
          name: 'web_identifier_id',
          type: 'INTEGER'
        }, {
          name: 'identifiable_id',
          type: 'INTEGER',
        }]
      end

      def table_name_prefix
        'z_web_identifiers'
      end
    end
  end
end
