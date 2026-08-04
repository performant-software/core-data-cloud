module CoreDataConnector
  class ProjectPolicy < BasePolicy
    attr_reader :current_user, :project

    def initialize(current_user, project)
      @current_user = current_user
      @project = project
    end

    # A user can analyze and import data into a project if they are an admin.
    def analyze_import?
      return true if current_user.admin?

      false
    end

    # A user can clear data from a project if they are an admin or an owner of the project.
    def clear?
      return true if current_user.admin?

      !project.archived? && project_owner?
    end

    # Users with an "admin" or "member" role can create projects.
    def create?
      current_user.admin? || current_user.member?
    end

    # A user can view any project for which they are a member.
    def show?
      return true if current_user.admin?

      !project.archived? && project_member?
    end

    # A user can delete a project if they are an admin or an owner of the project.
    def destroy?
      return true if current_user.admin?

      !project.archived? && project_owner?
    end

    # A user can export a project's configuration if they are an admin or an owner of the project.
    def export_configuration?
      return true if current_user.admin?

      !project.archived? && project_owner?
    end

    # A user can export data from a project if they are an admin.
    def export_data?
      return true if current_user.admin?

      false
    end

    # A user can export a project's environment variables if they are an admin or an owner of the project.
    def export_variables?
      return true if current_user.admin?

      !project.archived? && project_owner?
    end

    # A user can import data into a project if they are an admin.
    def import_analyze?
      return true if current_user.admin?

      false
    end

    # A user can import a project's configuration if they are an admin or an owner of the project.
    def import_configuration?
      return true if current_user.admin?

      !project.archived? && project_owner?
    end

    # A user can import data into a project if they are an admin.
    def import_data?
      return true if current_user.admin?

      false
    end

    # A user can view any project's map library for which they are a member.
    def map_library?
      return true if current_user.admin?

      !project.archived? && project_member?
    end

    # A user can update a project if they are an admin or an owner of the project.
    def update?
      return true if current_user.admin?

      !project.archived? && project_owner?
    end

    # Allowed create/update attributes.
    def permitted_attributes
      attributes = [
        :name,
        :description,
        :discoverable,
        :faircopy_cloud_url,
        :faircopy_cloud_project_id,
        :faircopy_cloud_project_model_id,
        :map_library_url,
        reconciliation_credentials: {}
      ]

      attributes << :archived if current_user.admin?

      attributes
    end

    private

    # Returns a query to find user_projects records for the passed user_id and project_id.
    def project_member?
      user_projects.exists?
    end

    # Returns a query to find user_projects records with an owner role for the passed user_id and project_id.
    def project_owner?
      user_projects
        .where(role: UserProject::ROLE_OWNER)
        .exists?
    end

    # Returns a query to find user_projects records for the current user and project.
    def user_projects
      current_user
        .user_projects
        .where(project_id: project.id)
    end

    # Admin users can view all projects. Non-admin users can view projects for which they are members.
    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        scope.where(
          UserProject
            .where(user_id: current_user.id)
            .where(UserProject.arel_table[:project_id].eq(Project.arel_table[:id]))
            .arel
            .exists
        )
      end
    end
  end
end