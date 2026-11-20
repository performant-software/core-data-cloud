module CoreDataConnector
  module Public
    module V1
      # Builds the "descriptors" payload for a project: an entry for every ProjectModel and
      # ProjectModelRelationship belonging to the project, plus their user-defined fields.
      #
      # Used by both the live GET /public/v1/projects/:id/descriptors endpoint and
      # Export::JsonExporter for offline exports.
      class DescriptorsQuery

        def initialize(project_id)
          @project_id = project_id
        end

        def call
          load_project_models + load_project_model_relationships
        end

        private

        attr_reader :project_id

        def load_project_model_relationships
          descriptors = []

          query = ProjectModelRelationship
                    .preload(:user_defined_fields, :primary_model)
                    .joins(:primary_model)
                    .where(primary_model: { project_id: project_id })

          query.find_each do |project_model_relationship|
            descriptor = {
              identifier: project_model_relationship.uuid,
              label: project_model_relationship.name,
              context: project_model_relationship.primary_model.name
            }

            if project_model_relationship.allow_inverse?
              descriptor[:inverse_label] = project_model_relationship.inverse_name
            end

            descriptors << descriptor

            project_model_relationship.user_defined_fields.each do |user_defined_field|
              descriptors << {
                identifier: user_defined_field.uuid,
                label: user_defined_field.column_name,
                context: project_model_relationship.name
              }
            end
          end

          descriptors
        end

        def load_project_models
          descriptors = []

          query = ProjectModel
                    .preload(:user_defined_fields)
                    .where(project_id: project_id)

          query.find_each do |project_model|
            descriptors << {
              identifier: project_model.uuid,
              label: project_model.name
            }

            project_model.user_defined_fields.each do |user_defined_field|
              descriptors << {
                identifier: user_defined_field.uuid,
                label: user_defined_field.column_name,
                context: project_model.name
              }
            end
          end

          descriptors
        end

      end
    end
  end
end
