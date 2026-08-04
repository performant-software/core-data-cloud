module CoreDataConnector
  class ProjectModelAccessesSerializer < BaseSerializer
    index_attributes :id, :project_model_id, project_model: ProjectModelsSerializer
    show_attributes :id, :project_model_id, project_model: ProjectModelsSerializer
  end
end