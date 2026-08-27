module CoreDataConnector
  class ProjectModelShare < ApplicationRecord
    belongs_to :project_model_access
    belongs_to :project_model
  end
end