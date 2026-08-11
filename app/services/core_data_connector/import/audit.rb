module CoreDataConnector
  module Import
    # Records PaperTrail versions for the records added and modified by an import.
    #
    # The importers write records directly via SQL, so the ActiveRecord callbacks that normally build a version are
    # never run. Instead, each importer writes a row into a temporary audit table for every record it creates or
    # updates, and this service converts those rows into version records at the end of the import.
    #
    # For an update, the audit row also carries a snapshot of the record's attributes taken before the import modified
    # it. That snapshot becomes the version's "object" and is diffed against the record's final state to build the
    # version's "object_changes".
    class Audit
      EVENT_CREATE = 'create'
      EVENT_UPDATE = 'update'

      # Models for which versions are generated
      MODELS = [
        CoreDataConnector::Event,
        CoreDataConnector::Instance,
        CoreDataConnector::Item,
        CoreDataConnector::MediaContent,
        CoreDataConnector::Organization,
        CoreDataConnector::OrganizationName,
        CoreDataConnector::Person,
        CoreDataConnector::PersonName,
        CoreDataConnector::Place,
        CoreDataConnector::PlaceGeometry,
        CoreDataConnector::PlaceName,
        CoreDataConnector::Relationship,
        CoreDataConnector::SourceName,
        CoreDataConnector::Taxonomy,
        CoreDataConnector::WebIdentifier,
        CoreDataConnector::Work
      ]

      # Top-level models that can appear in a version's "roots" attribute
      ROOT_MODELS = [
        CoreDataConnector::Event,
        CoreDataConnector::Instance,
        CoreDataConnector::Item,
        CoreDataConnector::MediaContent,
        CoreDataConnector::Organization,
        CoreDataConnector::Person,
        CoreDataConnector::Place,
        CoreDataConnector::Taxonomy,
        CoreDataConnector::Work
      ]

      attr_reader :table_name, :user_id

      def initialize(user_id = nil)
        @connection = ActiveRecord::Base.connection
        @user_id = user_id
        @table_name = "z_audit_records_#{Random.rand(1000..9999)}"
      end

      def cleanup
        execute <<-SQL.squish
          DROP TABLE IF EXISTS #{table_name}
        SQL
      end

      # Creates a version record for each row in the audit table
      def create_versions
        MODELS.each do |model|
          create_versions_for model
          update_versions_for model
        end
      end

      # Returns the SQL used to snapshot the records an importer is about to update. The passed "from" clause must
      # alias the table being updated as "records", so that a snapshot of its attributes can be taken. The "root_type"
      # and "root_id" values are SQL expressions, defaulting to the record itself.
      def record_updates_sql(model, from:, root_type: nil, root_id: nil, root_order: 1)
        <<-SQL.squish
          INSERT INTO #{table_name} (item_type, item_id, event, object, root_type, root_id, root_order)
          SELECT #{quote(model.name)},
                 records.id,
                 #{quote(EVENT_UPDATE)},
                 #{object(model)},
                 #{root_type || quote(model.name)},
                 #{root_id || 'records.id'},
                 #{root_order}
            #{from}
        SQL
      end

      def setup
        execute <<-SQL.squish
          CREATE TABLE #{table_name} (
            item_type VARCHAR NOT NULL,
            item_id INTEGER NOT NULL,
            event VARCHAR NOT NULL,
            object JSONB,
            root_type VARCHAR,
            root_id INTEGER,
            root_order INTEGER NOT NULL DEFAULT 1
          )
        SQL

        execute <<-SQL.squish
          CREATE INDEX #{table_name}_item_type_event_idx ON #{table_name} (item_type, event)
        SQL
      end

      private

      # Returns the names of the attributes stored in a version's "object_changes" for the passed model. This mirrors
      # the way PaperTrail resolves the "ignore", "skip", and "only" options.
      def audited_attributes(model)
        options = model.paper_trail_options

        ignore = string_option(options[:ignore])
        skip = string_option(options[:skip])
        only = string_option(options[:only])

        attributes = model.column_names - ignore - skip
        attributes = attributes & only if only.present?

        attributes
      end

      def create_versions_for(model)
        execute versions_sql(
          model,
          event: EVENT_CREATE,
          object: 'NULL::jsonb',
          object_changes: create_object_changes(model)
        )
      end

      # Returns the SQL expression used to build a "create" version's "object_changes" value. An attribute is included
      # only if it was actually set by the import, matching the way ActiveRecord excludes unset attributes and column
      # defaults from the changes of a newly created record.
      def create_object_changes(model)
        attributes = audited_attributes(model)
        return 'NULL::jsonb' if attributes.empty?

        expressions = attributes.map do |attribute|
          column = model.columns_hash[attribute]
          name = "records.#{quote_column(attribute)}"

          conditions = ["#{name} IS NOT NULL"]
          conditions << "#{name} IS DISTINCT FROM CAST(#{quote(column.default)} AS #{column.sql_type})" unless column.default.nil?

          <<-SQL.squish
            CASE WHEN #{conditions.join(' AND ')}
                 THEN jsonb_build_object(#{quote(attribute)}, jsonb_build_array(NULL::text, to_jsonb(#{name})))
                 ELSE '{}'::jsonb
                  END
          SQL
        end

        "NULLIF(#{expressions.join(' || ')}, '{}'::jsonb)"
      end

      # Returns the SQL expression used to resolve a root record's "display_name"
      def display_name(model)
        case model.name
        when CoreDataConnector::Event.name, CoreDataConnector::MediaContent.name, CoreDataConnector::Taxonomy.name
          "NULLIF(records.name, '')"
        when CoreDataConnector::Organization.name
          <<-SQL.squish
            ( SELECT NULLIF(names.name, '')
                FROM core_data_connector_organization_names names
               WHERE names.organization_id = records.id
                 AND names."primary"
               LIMIT 1 )
          SQL
        when CoreDataConnector::Person.name
          <<-SQL.squish
            ( SELECT CONCAT_WS(' ', names.first_name, names.middle_name, names.last_name)
                FROM core_data_connector_person_names names
               WHERE names.person_id = records.id
                 AND names."primary"
               LIMIT 1 )
          SQL
        when CoreDataConnector::Place.name
          <<-SQL.squish
            ( SELECT NULLIF(names.name, '')
                FROM core_data_connector_place_names names
               WHERE names.place_id = records.id
                 AND names."primary"
               LIMIT 1 )
          SQL
        else
          <<-SQL.squish
            ( SELECT NULLIF(names.name, '')
                FROM core_data_connector_source_names names
               WHERE names.nameable_id = records.id
                 AND names.nameable_type = #{quote(model.name)}
                 AND names."primary"
               LIMIT 1 )
          SQL
        end
      end

      def execute(sql)
        @connection.execute sql
      end

      # Returns the SQL expression used to snapshot a record's attributes, which becomes the version's "object" value.
      # PaperTrail stores every attribute other than those listed in the "skip" option.
      def object(model)
        attributes = model.column_names - string_option(model.paper_trail_options[:skip])

        expressions = attributes.map do |attribute|
          "#{quote(attribute)}, to_jsonb(records.#{quote_column(attribute)})"
        end

        "jsonb_build_object(#{expressions.join(', ')})"
      end

      def quote(value)
        @connection.quote value
      end

      def quote_column(name)
        @connection.quote_column_name name
      end

      # Returns the SQL used to resolve the attributes stored in a version's "roots" value for each type of root record
      def root_queries
        ROOT_MODELS.map do |model|
          <<-SQL.squish
            SELECT #{quote(model.name)} AS type,
                   records.id,
                   records.uuid,
                   records.project_model_id,
                   project_models.project_id,
                   #{display_name(model)} AS display_name
              FROM audit_root_ids
              JOIN #{model.table_name} records ON records.id = audit_root_ids.root_id
              LEFT JOIN core_data_connector_project_models project_models ON project_models.id = records.project_model_id
             WHERE audit_root_ids.root_type = #{quote(model.name)}
          SQL
        end.join(' UNION ALL ')
      end

      def string_option(option)
        Array(option).select{ |value| value.is_a?(String) }
      end

      # Returns the SQL expression used to build an "update" version's "object_changes" value, by comparing the
      # snapshot taken before the import ran against the record's final state.
      def update_object_changes(model)
        attributes = audited_attributes(model)
        return 'NULL::jsonb' if attributes.empty?

        expressions = attributes.map do |attribute|
          before = "COALESCE(audit_items.object -> #{quote(attribute)}, 'null'::jsonb)"
          after = "COALESCE(to_jsonb(records.#{quote_column(attribute)}), 'null'::jsonb)"

          <<-SQL.squish
            CASE WHEN #{before} <> #{after}
                 THEN jsonb_build_object(#{quote(attribute)}, jsonb_build_array(#{before}, #{after}))
                 ELSE '{}'::jsonb
                  END
          SQL
        end

        "NULLIF(#{expressions.join(' || ')}, '{}'::jsonb)"
      end

      def update_versions_for(model)
        # A record created by this import already has a "create" version covering its final state, so any subsequent
        # update to it is not recorded separately.
        exclude_creates = <<-SQL.squish
          AND NOT EXISTS ( SELECT 1
                             FROM #{table_name} creates
                            WHERE creates.item_type = audit.item_type
                              AND creates.item_id = audit.item_id
                              AND creates.event = #{quote(EVENT_CREATE)} )
        SQL

        # PaperTrail does not record a version when only ignored attributes have changed
        execute versions_sql(
          model,
          event: EVENT_UPDATE,
          object: 'audit_items.object',
          object_changes: update_object_changes(model),
          filter: exclude_creates,
          where: 'WHERE audit_versions.object_changes IS NOT NULL'
        )
      end

      def versions_sql(model, event:, object:, object_changes:, filter: nil, where: nil)
        <<-SQL.squish
          WITH

          audit_records AS (

          SELECT audit.item_id, audit.object, audit.root_type, audit.root_id, audit.root_order
            FROM #{table_name} audit
           WHERE audit.item_type = #{quote(model.name)}
             AND audit.event = #{quote(event)}
             #{filter}

          ),

          audit_root_ids AS (

          SELECT DISTINCT root_type, root_id
            FROM audit_records

          ),

          audit_roots AS (

          #{root_queries}

          ),

          audit_items AS (

          SELECT DISTINCT ON (item_id) item_id, object
            FROM audit_records
           ORDER BY item_id

          ),

          item_roots AS (

          SELECT audit_records.item_id,
                 jsonb_agg(
                   jsonb_build_object(
                     'type', audit_roots.type,
                     'id', audit_roots.id,
                     'display_name', audit_roots.display_name,
                     'uuid', audit_roots.uuid,
                     'project_model_id', audit_roots.project_model_id
                   ) ORDER BY audit_records.root_order
                 ) AS roots,
                 (array_agg(audit_roots.project_id ORDER BY audit_records.root_order))[1] AS project_id
            FROM audit_records
            JOIN audit_roots ON audit_roots.type = audit_records.root_type
                            AND audit_roots.id = audit_records.root_id
           GROUP BY audit_records.item_id

          ),

          audit_versions AS (

          SELECT #{quote(model.name)} AS item_type,
                 records.id AS item_id,
                 #{quote(event)} AS event,
                 #{whodunnit} AS whodunnit,
                 #{object} AS object,
                 #{object_changes} AS object_changes,
                 COALESCE(item_roots.roots, '[]'::jsonb) AS roots,
                 item_roots.project_id AS project_id,
                 records.updated_at AS created_at
            FROM audit_items
            JOIN #{model.table_name} records ON records.id = audit_items.item_id
            LEFT JOIN item_roots ON item_roots.item_id = audit_items.item_id

          )

          INSERT INTO #{CoreDataConnector::Version.table_name} (
            item_type,
            item_id,
            event,
            whodunnit,
            object,
            object_changes,
            roots,
            project_id,
            created_at
          )
          SELECT item_type,
                 item_id,
                 event,
                 whodunnit,
                 object,
                 object_changes,
                 roots,
                 project_id,
                 created_at
            FROM audit_versions
           #{where}
        SQL
      end

      def whodunnit
        user_id.present? ? quote(user_id.to_s) : 'NULL::varchar'
      end
    end
  end
end
