module CoreDataConnector
  class DirectUploadsController < ApplicationController
    # Actions
    before_action :check_policy, only: :create

    private

    def check_policy
      # If no storage key is present, assume the user can upload to the shared storage
      return unless request.headers['X-STORAGE-KEY'].present?

      project = Project.find_by(uuid: request.headers['X-STORAGE-KEY'])
      raise Pundit::NotAuthorizedError if project.nil?

      authorize project, :create?, policy_class: DirectUploadPolicy
    end
  end
end