class ProjectsSerializer < BaseSerializer
  index_attributes :id, :name, :description
  show_attributes :id, :name, :description
end
