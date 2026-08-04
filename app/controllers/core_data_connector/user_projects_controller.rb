module CoreDataConnector
  class UserProjectsController < ApplicationController
    # Search attributes
    search_attributes 'core_data_connector_users.name', 'core_data_connector_users.email', 'core_data_connector_projects.name', 'core_data_connector_projects.description'

    # Joins
    joins :user, :project

    # Preloads
    preloads :user, :project

    def invite
      user_project = UserProject.find(params[:id])
      authorize user_project, :invite?

      begin
        service = Users::Invitations.new
        service.send_invitation user_project
      rescue StandardError => error
        errors = [error]

        # Log the error
        log_error(error)
      end

      if errors.nil? || errors.empty?
        render json: { }, status: :ok
      else
        render json: { errors: errors }, status: :bad_request
      end
    end

    protected

    def base_query
      return super if params[:id].present?

      query = super

      # User projects are only visible in the context of a user or a project.
      if params[:project_id].present?
        query.where(project_id: params[:project_id])
      elsif params[:user_id].present?
        query.where(user_id: params[:user_id])
      else
        query.none
      end
    end
  end
end