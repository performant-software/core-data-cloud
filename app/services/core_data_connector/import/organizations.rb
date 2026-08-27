module CoreDataConnector
  module Import
    class Organizations < Base
      # Includes
      include Nameable

      def cleanup
        super

        execute <<-SQL.squish
          UPDATE core_data_connector_organizations
             SET z_organization_id = NULL
        SQL

        execute <<-SQL.squish
          VACUUM ANALYZE core_data_connector_organizations, core_data_connector_organization_names
        SQL
      end

      def load
        super

        # Snapshot the organizations about to be updated
        audit_updates(
          CoreDataConnector::Organization,
          from: <<-SQL.squish
            FROM #{table_name} z_organizations
            JOIN core_data_connector_organizations records ON records.id = z_organizations.organization_id
          SQL
        )

        # Update existing organizations
        execute <<-SQL.squish
          UPDATE core_data_connector_organizations organizations
             SET z_organization_id = z_organizations.id,
                 description = z_organizations.description,
                 user_defined = z_organizations.user_defined,
                 import_id = z_organizations.import_id,
                 updated_at = current_timestamp
            FROM #{table_name} z_organizations
           WHERE z_organizations.organization_id = organizations.id
        SQL

        # Insert new organizations
        execute <<-SQL.squish
          WITH 
          
          insert_organizations AS (

          INSERT INTO core_data_connector_organizations (
            project_model_id, uuid, 
            z_organization_id, 
            description, 
            user_defined,
            import_id,
            published,
            created_at, 
            updated_at
          )
          SELECT z_organizations.project_model_id, 
                 z_organizations.uuid, 
                 z_organizations.id, 
                 z_organizations.description, 
                 z_organizations.user_defined, 
                 z_organizations.import_id,
                 #{default_to_published('z_organizations')},
                 current_timestamp, 
                 current_timestamp
            FROM #{table_name} z_organizations
           WHERE z_organizations.organization_id IS NULL
          RETURNING id AS organization_id, z_organization_id

          ),

          update_organizations AS (

          UPDATE #{table_name} z_organizations
             SET organization_id = insert_organizations.organization_id
            FROM insert_organizations
           WHERE insert_organizations.z_organization_id = z_organizations.id

          )

          INSERT INTO #{audit_table} (item_type, item_id, event, root_type, root_id)
          SELECT 'CoreDataConnector::Organization',
                 insert_organizations.organization_id,
                 'create',
                 'CoreDataConnector::Organization',
                 insert_organizations.organization_id
            FROM insert_organizations
        SQL

        # Insert new organization_names
        execute <<-SQL.squish
          WITH 
 
          all_organization_names AS (
            
          SELECT z_organizations.organization_id AS organization_id, z_organizations.primary_name AS name
            FROM #{table_name} z_organizations
           UNION ALL
          SELECT z_organizations.organization_id AS organization_id, unnest(z_organizations.additional_names) AS name
            FROM #{table_name} z_organizations
          
          ),

          insert_organization_names AS (

          INSERT INTO core_data_connector_organization_names (
            organization_id,
            name,
            created_at,
            updated_at
          )
          SELECT all_organization_names.organization_id,
                 all_organization_names.name,
                 current_timestamp,
                 current_timestamp
            FROM all_organization_names
           WHERE NOT EXISTS ( SELECT 1
                                FROM core_data_connector_organization_names organization_names
                               WHERE organization_names.organization_id = all_organization_names.organization_id
                                 AND organization_names.name = all_organization_names.name )
          RETURNING id AS organization_name_id, organization_id

          )

          INSERT INTO #{audit_table} (item_type, item_id, event, root_type, root_id)
          SELECT 'CoreDataConnector::OrganizationName',
                 insert_organization_names.organization_name_id,
                 'create',
                 'CoreDataConnector::Organization',
                 insert_organization_names.organization_id
            FROM insert_organization_names
        SQL

        # Snapshot the organization_names about to have their "primary" indicator reset
        audit_updates(
          CoreDataConnector::OrganizationName,
          root_type: "'CoreDataConnector::Organization'",
          root_id: 'records.organization_id',
          from: <<-SQL.squish
            FROM #{table_name} z_organizations
            JOIN core_data_connector_organization_names records ON records.organization_id = z_organizations.organization_id
          SQL
        )

        # Reset all organization_names "primary" indicator to FALSE
        execute <<-SQL.squish
          UPDATE core_data_connector_organization_names organization_names
             SET "primary" = FALSE,
                 updated_at = current_timestamp
            FROM #{table_name} z_organizations
           WHERE z_organizations.organization_id = organization_names.organization_id
        SQL

        # Set organization_names "primary" indicator to TRUE
        execute <<-SQL.squish
          WITH 
              
          primary_organization_names AS (
              
          SELECT z_organizations.organization_id AS organization_id, z_organizations.primary_name AS name
            FROM #{table_name} z_organizations

          )

          UPDATE core_data_connector_organization_names organization_names
             SET "primary" = TRUE,
                 updated_at = current_timestamp
            FROM primary_organization_names
           WHERE primary_organization_names.organization_id = organization_names.organization_id
             AND primary_organization_names.name = organization_names.name
        SQL
      end

      def transform
        execute <<-SQL.squish
          UPDATE #{table_name} z_organizations
             SET organization_id = organizations.id,
                 user_defined = organizations.user_defined
            FROM core_data_connector_organizations organizations
           WHERE organizations.uuid = z_organizations.uuid
             AND z_organizations.uuid IS NOT NULL
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
           name: 'description',
           type: 'TEXT',
           copy: true
         }, {
           name: 'organization_id',
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
        'z_organizations'
      end
    end
  end
end