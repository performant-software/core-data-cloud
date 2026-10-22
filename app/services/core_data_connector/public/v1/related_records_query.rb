module CoreDataConnector
  module Public
    module V1
      # Builds the "related records" query used by the public v1 API's nested routes (e.g.
      # GET /public/v1/items/:item_id/instances): finds every published record of +related_class+
      # connected to +record+ via a Relationship, in either direction (respecting
      # ProjectModelRelationship#allow_inverse), scoped to the passed +project_ids+ and optionally a
      # single ProjectModelRelationship.
      #
      # This is used both by PublicController (for live requests) and by Export::JsonExporter (for
      # offline exports) so the relationship-traversal SQL lives in exactly one place.
      class RelatedRecordsQuery

        def initialize(record:, related_class:, project_ids:, project_model_relationship_uuid: nil)
          @record = record
          @related_class = related_class
          @project_ids = project_ids
          @project_model_relationship_uuid = project_model_relationship_uuid
        end

        # Returns the scoped, ordered, published query for +related_class+ records connected to +record+.
        def call
          related_class
            .joins(join_sql)
            .joins(project_model: :project)
            .where.not(project: { archived: true })
            .order('record.order')
            .published
        end

        # Preloads +relationships+/+related_relationships+ on the passed (already-loaded) +records+,
        # scoped to the specific connection back to +record+. This lets TypeableSerializer resolve
        # project_model_relationship_uuid/inverse without triggering unscoped N+1 queries.
        def preload(records)
          Preloader.new(
            records: records,
            associations: [relationships: [project_model_relationship: :user_defined_fields]],
            scope: scope_to_relationship(inverse_relationships_scope)
          ).call

          Preloader.new(
            records: records,
            associations: [related_relationships: [project_model_relationship: :user_defined_fields]],
            scope: scope_to_relationship(forward_relationships_scope)
          ).call
        end

        private

        attr_reader :record, :related_class, :project_ids, :project_model_relationship_uuid

        def join_sql
          <<-SQL.squish
            INNER JOIN (
              #{primary_query.to_sql}
              UNION ALL
              #{related_query.to_sql}
            ) record ON record.id = "#{related_class.table_name}"."id"
          SQL
        end

        # Relationships where +record+ is the primary record and +related_class+ is the related record.
        def primary_query
          scope_to_relationship(
            Relationship
              .joins(project_model_relationship: :primary_model)
              .where(
                related_record_type: related_class.to_s,
                primary_record_id: record.id,
                primary_record_type: record.class.to_s,
                primary_model: { project_id: project_ids }
              )
              .select(Relationship.arel_table[:related_record_id].as('id'))
              .select(Relationship.arel_table[:order].as('order'))
          )
        end

        # Relationships where +record+ is the related record and +related_class+ is the primary record
        # (only included when the connecting ProjectModelRelationship allows inverse traversal).
        def related_query
          scope_to_relationship(
            Relationship
              .joins(project_model_relationship: :related_model)
              .where(
                primary_record_type: related_class.to_s,
                related_record_id: record.id,
                related_record_type: record.class.to_s,
                related_model: { project_id: project_ids },
                project_model_relationship: { allow_inverse: true }
              )
              .select(Relationship.arel_table[:primary_record_id].as('id'))
              .select(Relationship.arel_table[:order].as('order'))
          )
        end

        # Scope for preloading a related record's +relationships+ association (where the related
        # record is the primary record, reached here via the inverse-allowed branch).
        def inverse_relationships_scope
          Relationship
            .joins(project_model_relationship: :related_model)
            .where(
              primary_record_type: related_class.to_s,
              related_record_id: record.id,
              related_record_type: record.class.to_s,
              related_model: { project_id: project_ids },
              project_model_relationship: { allow_inverse: true }
            )
        end

        # Scope for preloading a related record's +related_relationships+ association (where the
        # related record is the related record, and +record+ is the primary record).
        def forward_relationships_scope
          Relationship
            .joins(project_model_relationship: :primary_model)
            .where(
              related_record_type: related_class.to_s,
              primary_record_id: record.id,
              primary_record_type: record.class.to_s,
              primary_model: { project_id: project_ids }
            )
        end

        def scope_to_relationship(query)
          return query unless project_model_relationship_uuid.present?

          query.where(project_model_relationship: { uuid: project_model_relationship_uuid })
        end

      end
    end
  end
end
