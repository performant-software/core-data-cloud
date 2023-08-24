class Project < ApplicationRecord
  # Relationships
  has_many :user_projects, dependent: :destroy

  # Resourceable parameters
  allow_params :name, :description
end
