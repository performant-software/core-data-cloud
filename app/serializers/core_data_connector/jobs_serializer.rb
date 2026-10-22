module CoreDataConnector
  class JobsSerializer < BaseSerializer
    index_attributes :id, :project_id, :user_id, :job_type, :status, :download_url, :created_at,
                     project: ProjectsSerializer, user: UsersSerializer
    # Excluded as its own block (rather than listed plainly alongside the other attributes above)
    # so storage credentials stored under job.extra['storage'] (see
    # ProjectsController#generate_static_assets) are never exposed via this serializer.
    index_attributes(:extra) { |job| job.extra&.except('storage') }

    show_attributes :id, :project_id, :user_id, :job_type, :status, :download_url, :created_at,
                    project: ProjectsSerializer, user: UsersSerializer
    show_attributes(:extra) { |job| job.extra&.except('storage') }
  end
end