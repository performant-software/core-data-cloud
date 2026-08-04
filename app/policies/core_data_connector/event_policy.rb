module CoreDataConnector
  class EventPolicy < BasePolicy
    # Includes
    include MergeablePolicy
    include OwnablePolicy

    attr_reader :current_user, :event, :project_model_id, :project, :project_id

    def initialize(current_user, event)
      @current_user = current_user
      @event = event

      @project_model_id = event&.project_model_id
      @project = event&.project
      @project_id = event&.project_id
    end

    # Allowed create/update attributes.
    def permitted_attributes
      [ *ownable_attributes,
        *Event.permitted_params,
        :name,
        :description,
        user_defined: {}
      ]
    end

    # Include default ownable scope.
    class Scope < BaseScope
      include OwnableScope
    end
  end
end