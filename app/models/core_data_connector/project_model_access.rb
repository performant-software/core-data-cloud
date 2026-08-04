module CoreDataConnector
  class ProjectModelAccess < ApplicationRecord
    # Relationships
    belongs_to :project_model
    belongs_to :project
    has_many :project_model_shares, dependent: :destroy
  end
end