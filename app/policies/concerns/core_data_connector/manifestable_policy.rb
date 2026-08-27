module CoreDataConnector
  module ManifestablePolicy
    extend ActiveSupport::Concern

    included do
      def create_manifests?
        return true if current_user.admin?

        !project.archived? && member?
      end

      private

      # Returns true if the current user has a `user_projects` record for the project that owns the current record.
      def member?
        current_user
          .user_projects
          .where(project_id: project_id)
          .exists?
      end
    end
  end
end