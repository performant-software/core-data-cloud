module CoreDataConnector
  class UserProjectsSerializer < BaseSerializer
    index_attributes :id, :user_id, :project_id, :role, user: UsersSerializer, project: ProjectsSerializer
    show_attributes :id, :user_id, :project_id, :role, user: UsersSerializer, project: ProjectsSerializer
  end
end
