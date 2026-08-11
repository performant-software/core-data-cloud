module CoreDataConnector
  module PublishablePolicy
    extend ActiveSupport::Concern

    included do
      # A user can publish or unpublish a record if they are an admin or an owner of the project that owns the record.
      def publish?
        return true if current_user.admin?

        !project.archived? && project_owner?
      end

      private

      # Returns true if the current user has an owner `user_projects` record for the project that owns the record.
      def project_owner?
        current_user
          .user_projects
          .where(project_id: project_id)
          .where(role: UserProject::ROLE_OWNER)
          .exists?
      end
    end
  end
end
