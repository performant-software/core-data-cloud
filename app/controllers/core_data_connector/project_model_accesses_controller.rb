module CoreDataConnector
  class ProjectModelAccessesController < ApplicationController
    # Search attributes
    search_attributes 'core_data_connector_projects.name'

    # Joins
    joins project_model: :project

    # Preloads
    preloads project_model: :project

    protected

    def base_query
      query = super

      return ProjectModelAccess.none unless params[:project_id].present? && params[:model_class].present?

      query
        .where(project_id: params[:project_id])
        .where(core_data_connector_project_models: {
          model_class: params[:model_class]
        })
    end
  end
end