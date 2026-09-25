module CoreDataConnector
  class GenerateStaticAssetsJob < ApplicationJob
    # Number of resource IDs sent to IIIF Cloud per request.
    BATCH_SIZE = 100

    def perform(job_id)
      job = Job.find(job_id)
      job.update(status: Job::JOB_STATUS_PROCESSING)

      begin
        service = TripleEyeEffable::Cloud.new

        eligible_resource_ids(job).each_slice(BATCH_SIZE) do |batch|
          service.create_static_assets(
            resource_ids: batch,
            base_url: job.extra['base_url'],
            destination: job.extra['destination']
          )
        end

        job.update(status: Job::JOB_STATUS_COMPLETED)
      rescue StandardError => error
        log_error(error)
        job.update(status: Job::JOB_STATUS_FAILED)
      end
    end

    private

    # Resource IDs for media content with an uploaded IIIF Cloud resource, belonging to the
    # job's project. If a previous run of this job type completed successfully for this project,
    # only media content updated since then is included, so re-running is idempotent/incremental.
    def eligible_resource_ids(job)
      query = MediaContent
                .joins(:project_model, :resource_description)
                .where(project_model: { project_id: job.project_id })

      cutoff = last_completed_run(job)
      query = query.where('core_data_connector_media_contents.updated_at > ?', cutoff) if cutoff

      query.pluck('triple_eye_effable_resource_descriptions.resource_id')
    end

    def last_completed_run(job)
      Job
        .where(project_id: job.project_id, job_type: Job::JOB_TYPE_STATIC_ASSETS, status: Job::JOB_STATUS_COMPLETED)
        .where.not(id: job.id)
        .order(created_at: :desc)
        .pick(:created_at)
    end

    def log_error(error)
      Rails.logger.error(["#{self.class} - #{error.class}: #{error.message}", error.backtrace].join("\n"))
    end
  end
end
