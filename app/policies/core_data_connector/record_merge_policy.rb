module CoreDataConnector
  class RecordMergePolicy < BasePolicy
    attr_reader :current_user, :record_merge, :project, :project_id

    def initialize(current_user, record_merge)
      @current_user = current_user
      @record_merge = record_merge
      @project = record_merge&.mergeable&.project
      @project_id = record_merge&.mergeable&.project_id
    end

    # A record_merge cannot be created via the API, only through the merge function.
    def create?
      false
    end

    # A user can delete a record_merge if they are an admin user or member of owning the project.
    def destroy?
      return true if current_user.admin?

      !project.archived? && member?
    end

    # A record_merge cannot be viewed via the API.
    def show?
      false
    end

    # A record_merge cannot be updated via the API.
    def update?
      false
    end

    private

    # Returns true if the current user has a `user_projects` record for the web identifier's project.
    def member?
      current_user
        .user_projects
        .joins(:project)
        .where(project_id: project_id)
        .where.not(project: { archived: true })
        .exists?
    end
  end
end