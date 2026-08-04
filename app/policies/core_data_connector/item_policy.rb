module CoreDataConnector
  class ItemPolicy < BasePolicy
    # Includes
    include MergeablePolicy
    include OwnablePolicy

    attr_reader :current_user, :item, :project_model_id, :project, :project_id

    def initialize(current_user, item)
      @current_user = current_user
      @item = item

      @project_model_id = item&.project_model_id
      @project = item&.project
      @project_id = item&.project_id
    end

    # A user can analyze the import for an item if the user is an admin or has update permissions.
    def analyze_import?
      return true if current_user.admin?

      update?
    end

    # A user can import for an item if the user is an admin or has update permissions.
    def import?
      return true if current_user.admin?

      update?
    end

    # Allowed create/update attributes.
    def permitted_attributes
      [ *ownable_attributes,
        :faircopy_cloud_id,
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