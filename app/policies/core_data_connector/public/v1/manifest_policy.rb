module CoreDataConnector
  module Public
    module V1
      class ManifestPolicy < BasePolicy
        attr_reader :project

        def initialize(current_user, record)
          @project = record.project_model_relationship.project
        end

        def create?
          false
        end

        def destroy?
          false
        end

        def show?
          !project.archived?
        end

        def update?
          false
        end

        class Scope < BaseScope
          def resolve
            scope
              .joins(project_model_relationship: [primary_model: :project])
              .where.not(project: { archived: true })
          end
        end
      end
    end
  end
end