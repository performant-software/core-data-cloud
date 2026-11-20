module CoreDataConnector
  class GenerateStaticAssetsJob < ApplicationJob
    # Number of resource IDs sent to IIIF Cloud per request. IIIF Cloud enqueues one
    # CreateStaticAssetsJob per resource and responds as soon as they're queued (it no longer
    # generates the batch synchronously within the request), so this is sized for reasonable HTTP
    # request/response overhead rather than any processing-time constraint.
    BATCH_SIZE = 100

    # IIIF Cloud only enqueues the actual asset-generation work (see Public::JobsController in
    # iiif-cloud); it doesn't finish by the time create_static_assets responds. So once the
    # batches are submitted, this job polls IIIF Cloud's job status endpoint instead of marking
    # itself complete immediately. Configurable since poll frequency/patience is a deployment
    # concern, not a code concern.
    POLL_INTERVAL = ENV.fetch('STATIC_ASSETS_JOB_POLL_INTERVAL_SECONDS', '15').to_i.seconds
    POLL_MAX_ATTEMPTS = ENV.fetch('STATIC_ASSETS_JOB_POLL_MAX_ATTEMPTS', '240').to_i

    def perform(job_id)
      job = Job.find(job_id)

      if job.extra['iiif_cloud_job_uuid'].blank?
        start(job)
      else
        poll(job)
      end
    end

    private

    # Submits the eligible resources to IIIF Cloud (in batches, all under one shared job_uuid so
    # IIIF Cloud tracks them as a single job) and schedules the first status poll.
    def start(job)
      job.update(status: Job::JOB_STATUS_PROCESSING)

      resource_ids = eligible_resource_ids(job)

      if resource_ids.empty?
        finalize!(job, status: Job::JOB_STATUS_COMPLETED)
        return
      end

      job_uuid = SecureRandom.uuid
      service = TripleEyeEffable::Cloud.new

      resource_ids.each_slice(BATCH_SIZE) do |batch|
        service.create_static_assets(
          resource_ids: batch,
          base_url: job.extra['base_url'],
          destination: job.extra['destination'],
          job_uuid: job_uuid,
          storage: job.extra['storage'].symbolize_keys
        )
      end

      job.update(extra: job.extra.merge('iiif_cloud_job_uuid' => job_uuid, 'iiif_cloud_poll_attempts' => 0))
      schedule_poll(job)
    rescue StandardError => error
      log_error(error)
      finalize!(job, status: Job::JOB_STATUS_FAILED)
    end

    # Checks IIIF Cloud's reported status for the job_uuid submitted in #start. A transient error
    # making that request is treated the same as "not done yet" (retried up to POLL_MAX_ATTEMPTS)
    # rather than failing the whole job on a single blip.
    def poll(job)
      remote = TripleEyeEffable::Cloud.new.job_status(job.extra['iiif_cloud_job_uuid'])

      case remote[:status].to_s
      when Job::JOB_STATUS_COMPLETED
        finalize!(job, status: Job::JOB_STATUS_COMPLETED)
      when Job::JOB_STATUS_FAILED
        log_error(StandardError.new("IIIF Cloud reported job failure (#{remote[:failed_count]}/#{remote[:total_count]} resources failed)"))
        finalize!(job, status: Job::JOB_STATUS_FAILED)
      else
        reschedule_or_timeout(job, progress: remote[:completed_count] + remote[:failed_count])
      end
    rescue StandardError => error
      log_error(error)
      # No successful response to read a progress count from - this attempt counts toward the
      # timeout the same as if IIIF Cloud had reported no progress.
      reschedule_or_timeout(job, progress: nil)
    end

    # POLL_MAX_ATTEMPTS bounds consecutive polls with *no observed progress*, not the job's total
    # wall-clock running time - large projects can take far longer than POLL_MAX_ATTEMPTS *
    # POLL_INTERVAL to finish, as long as more resources keep completing/failing along the way.
    # Each time completed_count + failed_count moves, that's confirmation IIIF Cloud is still
    # actively working through the batch, so the attempt count resets instead of accumulating
    # toward a timeout that's only meant to catch a job that's actually stalled.
    def reschedule_or_timeout(job, progress:)
      last_progress = job.extra['iiif_cloud_last_progress']
      attempts = progress && progress != last_progress ? 0 : (job.extra['iiif_cloud_poll_attempts'] || 0) + 1

      extra = job.extra.merge('iiif_cloud_poll_attempts' => attempts)
      extra['iiif_cloud_last_progress'] = progress if progress

      if attempts >= POLL_MAX_ATTEMPTS
        log_error(StandardError.new("Timed out after #{attempts} attempts with no progress waiting for IIIF Cloud job #{job.extra['iiif_cloud_job_uuid']}"))
        finalize!(job, status: Job::JOB_STATUS_FAILED, extra: extra)
      else
        job.update(extra: extra)
        schedule_poll(job)
      end
    end

    def schedule_poll(job)
      self.class.set(wait: POLL_INTERVAL).perform_later(job.id)
    end

    # Marks the job with its final status, clearing the stored storage credentials along the way
    # since they're no longer needed once the job can't make any more outbound requests.
    def finalize!(job, status:, extra: job.extra)
      job.update(status: status, extra: extra.except('storage'))
    end

    # Resource IDs for media content with an uploaded IIIF Cloud resource, belonging to the
    # job's project. If a previous run of this job type completed successfully for this project,
    # only media content updated since then is included, so re-running is idempotent/incremental.
    def eligible_resource_ids(job)
      query = MediaContent
                .joins(:project_model, :resource_description)
                .where(project_model: { project_id: job.project_id })
                .published

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
