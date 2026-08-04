module CoreDataConnector
  class Job < ApplicationRecord
    JOB_STATUS_INITIALIZING = 'initializing'
    JOB_STATUS_PROCESSING = 'processing'
    JOB_STATUS_COMPLETED = 'completed'
    JOB_STATUS_FAILED = 'failed'

    JOB_TYPE_EXPORT = 'export'
    JOB_TYPE_IMPORT = 'import'

    # Includes
    include Rails.application.routes.url_helpers

    # Relationships
    belongs_to :project
    belongs_to :user

    # Active storage
    has_one_attached :file

    # Callbacks
    after_create_commit :queue_export_job, if: :export?
    after_create_commit :queue_import_job, if: :import?

    def download_url
      return nil unless file.attached?

      rails_blob_url file, disposition: 'attachment'
    end

    def export?
      job_type == JOB_TYPE_EXPORT
    end

    def import?
      job_type == JOB_TYPE_IMPORT
    end

    private

    def queue_export_job
      ExportCsvJob.perform_later(id)
    end

    def queue_import_job
      ImportCsvJob.perform_later(id)
    end
  end
end