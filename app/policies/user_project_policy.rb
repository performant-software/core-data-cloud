class UserProjectPolicy < BasePolicy
  attr_accessor :current_user, :user_project

  def initialize(current_user, user_project)
    @current_user = current_user
    @user_project = user_project
  end

  # A user can create user projects only for projects which they are an owner.
  def create?
    return true if current_user.admin?

    owner?
  end

  # A user can destroy user projects only for projects which they are an owner.
  def destroy?
    return true if current_user.admin?

    owner?
  end

  # A user can view user projects for projects which they are a member.
  def show?
    return true if current_user.admin?

    member?
  end

  # A user can update user projects only for projects which they are an owner.
  def update?
    return true if current_user.admin?

    owner?
  end

  # Allowed create/update attributes.
  def permitted_params
    [:user_id, :project_id, :role]
  end

  private

  # Returns true if the current user is a member of the current user project's project.
  def member?
    user_projects.exists?
  end

  # Returns true if the current user is an owner of the current user project's project.
  def owner?
    user_projects
      .where(role: UserProject::ROLE_OWNER)
      .exists?
  end

  # Returns a query to find user_projects for the current user for current user_project's project.
  def user_projects
    current_user
      .user_projects
      .where(project_id: user_project.project_id)
  end

  # A user can view the user_projects for any project for which they are a member.
  class Scope < BaseScope
    def resolve
      return scope.all if current_user.admin?

      user_projects = UserProject.arel_table.alias('b')

      UserProject.where(
        UserProject
          .arel_table
          .project(1)
          .from(user_projects)
          .where(user_projects[:project_id].eq(UserProject.arel_table[:project_id]))
          .where(user_projects[:user_id].eq(current_user.id))
          .exists
          .to_sql
      )
    end
  end
end
