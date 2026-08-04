module CoreDataConnector
  class InstancePolicy < BasePolicy
    # Includes
    include MergeablePolicy
    include OwnablePolicy

    attr_reader :current_user, :instance, :project_model_id, :project, :project_id

    def initialize(current_user, instance)
      @current_user = current_user
      @instance = instance

      @project_model_id = instance&.project_model_id
      @project = instance&.project
      @project_id = instance&.project_id
    end

    # Allowed create/update attributes.
    def permitted_attributes
      [ *ownable_attributes,
        user_defined: {},
        source_names_attributes: [:id, :name, :primary, :_destroy]
      ]
    end

    # Include default ownable scope.
    class Scope < BaseScope
      include OwnableScope
    end
  end
end