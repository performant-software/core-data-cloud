module CoreDataConnector
  class ProjectModelAccessPolicy < BasePolicy
    attr_accessor :current_user, :project_model_access, :project

    def initialize(current_user, project_model_access)
      @current_user = current_user
      @project_model_access = project_model_access
      @project = project_model_access&.project_model&.project
    end

    # A user cannot create a project_model_access via the /project_model_accesses API
    def create?
      false
    end

    # A user cannot delete a project_model_access via the /project_model_accesses API
    def destroy?
      false
    end

    # A user cannot view a project_model_access via the /project_model_accesses API
    def show?
      false
    end

    # A user cannot update a project_model_access via the /project_model_accesses API
    def update?
      false
    end

    # Returns a query to find all of the project_model_access records for the projects the current user
    # has access to.
    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        scope.where(
          UserProject
            .joins(:project)
            .where(UserProject.arel_table[:project_id].eq(ProjectModelAccess.arel_table[:project_id]))
            .where(user_id: current_user.id)
            .where.not(project: { archived: true })
            .arel
            .exists
        )
      end
    end
  end
end