module CoreDataConnector
  module OwnablePolicy
    extend ActiveSupport::Concern

    included do
      # A user can create an owned record for projects of which they are a member.
      def create?
        return true if current_user.admin?

        !project.archived? && member?
      end

      # A user can delete an owned record if they are a member of the owning project and the record has not been
      # shared with other projects.
      def destroy?
        return true if current_user.admin?

        !project.archived? && member? && !shared?
      end

      # A user can view an owned record if they are a member of the owning project or a member of a project
      # with which the record has been shared.
      def show?
        return true if current_user.admin?

        !project.archived? && (member? || access_member?)
      end

      # A user can update an owned record if they are a member of the owning project or a member of a project
      # with which the record has been shared.
      def update?
        return true if current_user.admin?

        !project.archived? && (member? || access_member?)
      end

      protected

      # Returns true if the current has has a `user_projects` record for a project which shares data with the project
      # that owns the current record.
      def access_member?
        ProjectModelShare
          .joins(project_model_access: [project: :user_projects])
          .joins(project_model_access: :project_model)
          .where(core_data_connector_user_projects: { user_id: current_user.id })
          .where(core_data_connector_project_models: { project_id: project_id })
          .exists?
      end

      # Returns true if the current user has a `user_projects` record for the project that owns the current record.
      def member?
        current_user
          .user_projects
          .where(project_id: project_id)
          .exists?
      end

      def ownable_attributes
        [ :project_model_id ]
      end

      # Returns true if the current has belongs to a `project_model` that has been shared with other projects.
      def shared?
        ProjectModelAccess
          .where(project_model_id: project_model_id)
          .exists?
      end
    end
  end
end