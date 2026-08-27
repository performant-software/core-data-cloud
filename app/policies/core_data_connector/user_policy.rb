module CoreDataConnector
  class UserPolicy < BasePolicy
    attr_reader :current_user, :user

    def initialize(current_user, user)
      @current_user = current_user
      @user = user
    end

    # Only admin users can create users directly.
    def create?
      current_user.admin?
    end

    # Only admin users can delete a user.
    def destroy?
      # Users cannot delete themselves, not even an admin
      return false if current_user.id == user.id

      current_user.admin?
    end

    # Only admin users can view background jobs.
    def jobs?
      current_user.admin?
    end

    # Only admin users can view users outside the context of a project. Users can view
    # themselves outside the context of a project.
    def show?
      return true if current_user.admin?

      current_user.id == user.id
    end

    # Only admin users can update users outside the context of a project. Users can update
    # themselves outside the context of a project.
    def update?
      return true if current_user.admin?

      current_user.id == user.id
    end

    # Allowed create/update attributes. Non-admin users can only change their password.
    def permitted_attributes
      attributes = []
      attributes += [:password, :password_confirmation] if current_user.admin? || current_user.sso_id.blank?
      attributes += [:name, :email, :role, :require_password_change] if current_user.admin?
      attributes
    end

    # Users can only view themselves outside of a project context.
    class Scope < BaseScope
      def resolve
        return scope.all if current_user.admin?

        User.where(id: current_user.id)
      end
    end
  end
end