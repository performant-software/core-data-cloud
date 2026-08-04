module CoreDataConnector
  class WebIdentifierPolicy < BasePolicy
    attr_reader :current_user, :web_identifier, :project, :project_id

    def initialize(current_user, web_identifier)
      @current_user = current_user
      @web_identifier = web_identifier
      @project = web_identifier&.project
      @project_id = web_identifier&.project_id
    end

    # A user can create a web identifier if they are an admin user or member of owning the project.
    def create?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A user can delete a web identifier if they are an admin user or member of owning the project.
    def destroy?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A user can view a web identifier if they are an admin user or member of owning the project.
    def show?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A user can update a web identifier if they are an admin user or member of owning the project.
    def update?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # Allowed create/update attributes
    def permitted_attributes
      [:web_authority_id, :identifiable_id, :identifiable_type, :identifier, extra: {}]
    end

    private

    # Returns true if the current user has a `user_projects` record for the web identifier's project.
    def member?
      current_user
        .user_projects
        .where(project_id: project_id)
        .exists?
    end

    # A user can view web identifiers for all projects of which they are a member.
    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        scope.where(
          UserProject
            .joins(project: :web_authorities)
            .where(WebAuthority.arel_table[:id].eq(WebIdentifier.arel_table[:web_authority_id]))
            .where(user_id: current_user.id)
            .where.not(project: { archived: true })
            .arel
            .exists
        )
      end
    end
  end
end