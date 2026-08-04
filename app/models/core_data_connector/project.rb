module CoreDataConnector
  class Project < ApplicationRecord
    # Relationships
    has_many :project_models, dependent: :destroy
    has_many :user_projects, dependent: :destroy
    has_many :web_authorities, dependent: :destroy

    def storage_key
      return nil unless use_storage_key?

      uuid
    end
  end
end