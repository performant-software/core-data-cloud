class UserPolicy < BasePolicy
  attr_reader :current_user, :user

  def initialize(current_user, user)
    @current_user = current_user
    @user = user
  end

  # All users can add other users.
  def create?
    true
  end

  # Only admin users can delete a user.
  def destroy?
    # Users cannot delete themselves, not even an admin
    return false if current_user.id == user.id

    current_user.admin?
  end

  # Only admin users can view users outside the context of a project. Users can view themselves outside the
  # context of a project.
  def show?
    return true if current_user.admin?

    current_user.id == user.id
  end

  # Only admin users can update a user record.
  def update?
    current_user.admin?
  end

  # Allowed create/update attributes.
  def permitted_params
    params = [:name, :email, :password, :password_confirmation]
    params << :admin if current_user.admin?
    params
  end

  # A user can view another user if they have access to the same project.
  class Scope < BaseScope
    def resolve
      return scope.all if current_user.admin?

      user_projects = UserProject.arel_table.alias('b')

      scope.where(
        UserProject
          .where(UserProject.arel_table[:user_id].eq(User.arel_table[:id]))
          .where(
            UserProject
              .arel_table
              .project(1)
              .from(user_projects)
              .where(user_projects[:project_id].eq(UserProject.arel_table[:project_id]))
              .where(user_projects[:user_id].eq(current_user.id))
              .exists
              .to_sql
          ).arel.exists
      )
    end
  end
end
