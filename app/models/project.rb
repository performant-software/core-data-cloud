class Project < ApplicationRecord
  # Relationships
  has_many :user_projects, dependent: :destroy
end
