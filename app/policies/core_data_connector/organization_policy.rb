module CoreDataConnector
  class OrganizationPolicy < BasePolicy
    # Includes
    include MergeablePolicy
    include OwnablePolicy

    attr_reader :current_user, :organization, :project_model_id, :project, :project_id

    def initialize(current_user, organization)
      @current_user = current_user
      @organization = organization

      @project_model_id = organization&.project_model_id
      @project = organization&.project
      @project_id = organization&.project_id
    end

    # Allowed create/update attributes.
    def permitted_attributes
      [ *ownable_attributes,
        :description,
        user_defined: {},
        organization_names_attributes: [:id, :name, :primary, :_destroy]
      ]
    end

    # Include default ownable scope.
    class Scope < BaseScope
      include OwnableScope
    end
  end
end