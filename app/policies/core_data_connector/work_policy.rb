module CoreDataConnector
  class WorkPolicy < BasePolicy
    # Includes
    include MergeablePolicy
    include OwnablePolicy

    attr_reader :current_user, :work, :project_model_id, :project, :project_id

    def initialize(current_user, work)
      @current_user = current_user
      @work = work

      @project_model_id = work&.project_model_id
      @project = work&.project
      @project_id = work&.project_id
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
