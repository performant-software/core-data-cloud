class UserProject < ApplicationRecord
  # Relationships
  belongs_to :user
  belongs_to :project

  # Resourceable parameters
  allow_params :user_id, :project_id, :role

  # Validations
  validates_presence_of :role
end
