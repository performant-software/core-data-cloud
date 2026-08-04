module CoreDataConnector
  class JobsController < ApplicationController
    # Search attributes
    search_attributes 'core_data_connector_users.name', 'core_data_connector_projects.name', :job_type

    # Joins
    joins :project, :user

    # Preloads
    preloads file_attachment: :blob
    preloads :project, :user

    protected

    def apply_filters(query)
      query = super

      query = filter_project(query)

      query
    end

    private

    def filter_project(query)
      return query unless params[:project_id].present?

      query.where(project_id: params[:project_id])
    end
  end
end