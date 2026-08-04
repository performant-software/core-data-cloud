module CoreDataConnector
  module Iiif
    class Manifest
      def self.generate_identifier(model_class:, uuid:, project_model_relationship_uuid: nil)
        route_name = model_class.model_name.route_key.singularize

        manifest_key = project_model_relationship_uuid.present? ? 'manifest' : 'manifests'
        method_name = "public_v1_#{route_name}_#{manifest_key}_path"

        router_helpers = Engine.routes.url_helpers
        router_helpers.send(method_name.to_sym, uuid, project_model_relationship_uuid)
      end

      def find_label(record)
        return record.full_name if record.is_a?(Person)

        return record.name if record.respond_to?(:name)

        nil
      end

      def reset_manifests
        # Find all project models that have a relationship
        ProjectModel.model_classes.each do |model_class|
          next unless model_class.ancestors.include?(Manifestable)

          options = {
            limit: ENV['IIIF_MANIFEST_ITEM_LIMIT']
          }

          reset_manifests_by_type model_class, options
        end
      end

      def reset_manifests_by_type(model_class, options = {})
        service = TripleEyeEffable::Presentation.new

        query = build_query(model_class, options)

        query.in_batches do |batch|
          apply_preloads batch, options

          batch.each do |record|
            # Build a mapping of all of the related resources indexed by project_model_relationship
            hash = {}

            # Generate the manifest label for the current record
            label = find_label(record)

            record.relationships.each do |relationship|
              project_model_relationship = relationship.project_model_relationship
              resource = relationship.related_record

              add_resource hash, project_model_relationship, resource
            end

            record.related_relationships.each do |relationship|
              project_model_relationship = relationship.project_model_relationship
              resource = relationship.primary_record

              add_resource hash, project_model_relationship, resource
            end

            # Iterate over all of the relationships and build a manifest for each
            hash.keys.each do |project_model_relationship_uuid|
              info = hash[project_model_relationship_uuid]

              identifier = self.class.generate_identifier(
                model_class: model_class,
                uuid: record.uuid,
                project_model_relationship_uuid: project_model_relationship_uuid
              )

              # Create or update the manifest records
              project_model_relationship_id = info[:id]
              manifest = find_manifest(record, project_model_relationship_id)

              if manifest.nil?
                manifest = CoreDataConnector::Manifest.new(
                  manifestable: record,
                  project_model_relationship_id: project_model_relationship_id,
                  identifier: identifier
                )
              end

              manifest.identifier = identifier

              # Get the resources from the info object, limiting if required
              resources = info[:resources]
              resources = resources.take(options[:limit].to_i) if options[:limit].present?

              # Set the thumbnail and label on the manifest
              manifest.thumbnail = resources.first
              manifest.label = info[:name]
              manifest.item_count = resources.size

              # Create the manifest
              manifest.content = service.create_manifest(
                id: "#{ENV['HOSTNAME']}/#{identifier}",
                label: I18n.t('services.iiif.manifest.label', name: label, relationship: info[:name]),
                resource_ids: resources
              )

              manifest.save
            end
          end
        end
      end

      private

      def add_resource(hash, project_model_relationship, resource)
        key = project_model_relationship.uuid

        hash[key] ||= {
          id: project_model_relationship.id,
          name: project_model_relationship.name,
          resources: []
        }

        hash[key][:resources] << resource.resource_description.resource_id
      end

      def apply_preloads(query, options)
        relationships_scope = Relationship
                                .joins(:related_media_content)
                                .order(
                                  Relationship.arel_table[:order],
                                  MediaContent.arel_table[:name],
                                  MediaContent.arel_table[:id]
                                )

        if options[:project_model_relationship_id].present?
          relationships_scope = relationships_scope.where(
            project_model_relationship_id: options[:project_model_relationship_id]
          )
        end

        Preloader.new(
          records: query,
          associations: [
            relationships: [:project_model_relationship, :related_record]
          ],
          scope: relationships_scope
        ).call

        related_relationships_scope = Relationship
                                        .joins(:project_model_relationship)
                                        .joins(:inverse_related_media_content)
                                        .where(project_model_relationship: { allow_inverse: true })
                                        .order(
                                          Relationship.arel_table[:order],
                                          MediaContent.arel_table[:name],
                                          MediaContent.arel_table[:id]
                                        )

        if options[:project_model_relationship_id].present?
          related_relationships_scope = related_relationships_scope.where(
            project_model_relationship_id: options[:project_model_relationship_id]
          )
        end

        Preloader.new(
          records: query,
          associations: [
            related_relationships: [:project_model_relationship, :primary_record]
          ],
          scope: related_relationships_scope
        ).call
      end

      def build_query(model_class, options)
        primary_model_table = Arel::Table.new('primary_model')
        related_model_table = Arel::Table.new('related_model')

        primary_query = ProjectModel
                          .joins(project_model_relationships: [:primary_model, :related_model])
                          .where(primary_model_table[:id].eq(model_class.arel_table[:project_model_id]))
                          .where(related_model: { model_class: MediaContent.to_s })

        related_query = ProjectModel
                          .joins(project_model_relationships: [:primary_model, :related_model])
                          .where(related_model_table[:id].eq(model_class.arel_table[:project_model_id]))
                          .where(project_model_relationships: { allow_inverse: true })
                          .where(primary_model: { model_class: MediaContent.to_s })

        query = model_class
                  .where(primary_query.or(related_query).arel.exists)


        if options[:id].present?
          query = query.where(id: options[:id])
        end

        query
      end

      def find_manifest(record, project_model_relationship_id)
        record.manifests.select{ |m| m.project_model_relationship_id == project_model_relationship_id }.first
      end

    end
  end
end