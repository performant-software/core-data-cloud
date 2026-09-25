module CoreDataConnector
  class GenerateStaticManifestsJob < ApplicationJob
    def perform(job_id)
      job = Job.find(job_id)
      job.update(status: Job::JOB_STATUS_PROCESSING)

      begin
        model_classes(job).each { |model_class| generate_for_model(job, model_class) }

        job.update(status: Job::JOB_STATUS_COMPLETED)
      rescue StandardError => error
        log_error(error)
        job.update(status: Job::JOB_STATUS_FAILED)
      end
    end

    private

    def generate_for_model(job, model_class)
      service = Iiif::StaticManifest.new(
        image_base_url: job.extra['image_base_url'],
        manifest_base_url: job.extra['manifest_base_url'],
        destination: job.extra['destination']
      )

      service.generate(model_class, options_for(job, model_class))
    end

    # Restricts to a single model class (by route key, e.g. "works") when specified; otherwise
    # every model class capable of having a manifest.
    def model_classes(job)
      classes = ProjectModel.model_classes.select { |klass| klass.ancestors.include?(Manifestable) }
      return classes if job.extra['model_class'].blank?

      classes.select { |klass| klass.model_name.route_key == job.extra['model_class'] }
    end

    # Restricts to a single record (by uuid) within model_class when specified.
    def options_for(job, model_class)
      options = { project_id: job.project_id, limit: ENV['IIIF_MANIFEST_ITEM_LIMIT'] }
      return options if job.extra['record_uuid'].blank?

      record = model_class.find_by(uuid: job.extra['record_uuid'])
      # 0 never matches a real id, so an unresolved uuid safely yields zero records rather than
      # silently falling back to "no id restriction" (which would process every record).
      options[:id] = record&.id || 0

      options
    end

    def log_error(error)
      Rails.logger.error(["#{self.class} - #{error.class}: #{error.message}", error.backtrace].join("\n"))
    end
  end
end
