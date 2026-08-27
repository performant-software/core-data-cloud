module CoreDataConnector
  class JobsSerializer < BaseSerializer
    index_attributes :id, :project_id, :user_id, :job_type, :status, :download_url, :created_at, :extra,
                     project: ProjectsSerializer, user: UsersSerializer

    show_attributes :id, :project_id, :user_id, :job_type, :status, :download_url, :created_at, :extra,
                    project: ProjectsSerializer, user: UsersSerializer
  end
end