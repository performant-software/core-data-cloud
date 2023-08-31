class ProjectItem < ApplicationRecord
  # Relationships
  belongs_to :project
  belongs_to :projectable, polymorphic: true
end
