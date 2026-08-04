module CoreDataConnector
  class ProjectModelsController < ApplicationController
    # Search attributes
    search_attributes :name

    # Preloads
    preloads :project, only: :index
    preloads :project_model_shares, only: :index
    preloads project_model_relationships: :related_model, only: :show
    preloads inverse_project_model_relationships: :primary_model, only: :show
    preloads project_model_accesses: :project, only: :show
    preloads project_model_shares: [project_model_access: :project_model], only: :show

    # Returns a list of valid model classes
    def model_classes
      classes = ProjectModel
                  .model_classes
                  .map(&:model_name)
                  .map{ |mn| { label: mn.human, value: mn.name } }
                  .sort_by{ |mn| mn[:label] }

      render json: { model_classes: classes }, status: :ok
    end

    protected

    # Project settings cannot be viewed outside the context of a project
    def base_query
      query = super

      if params[:id].present?
        query = query.where(id: params[:id])
      elsif params[:project_id].present?
        query = query.where(project_id: params[:project_id])
      else
        query = ProjectModel.none
      end

      if params[:model_class].present?
        query = query.where(model_class: params[:model_class])
      end

      query
    end
  end
end