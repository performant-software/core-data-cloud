module CoreDataConnector
  class PersonPolicy < BasePolicy
    include MergeablePolicy
    include OwnablePolicy

    attr_reader :current_user, :person, :project_model_id, :project, :project_id

    def initialize(current_user, person)
      @current_user = current_user
      @person = person

      @project_model_id = person&.project_model_id
      @project = person&.project
      @project_id = person&.project_id
    end

    # Allowed create/update attributes.
    def permitted_attributes
      [ *ownable_attributes,
        :biography,
        user_defined: {},
        person_names_attributes: [:id, :first_name, :middle_name, :last_name, :primary, :_destroy]
      ]
    end

    # Include default ownable scope.
    class Scope < BaseScope
      include OwnableScope
    end
  end
end