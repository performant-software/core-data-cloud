module CoreDataConnector
  class DirectUploadPolicy < BasePolicy

    attr_accessor :current_user, :project

    def initialize(current_user, project)
      @current_user = current_user
      @project = project
    end

    # A user can direct upload to a project if they are an admin or a member of the non-archived project.
    def create?
      return true if current_user.admin?

      !project.archived? && member?
    end

    private

    def member?
      current_user
        .user_projects
        .where(project_id: project.id)
        .exists?
    end
  end
end