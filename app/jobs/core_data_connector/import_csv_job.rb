module CoreDataConnector
  class ImportCsvJob < ApplicationJob

    def perform(job_id)
      job = Job.find(job_id)

      # Update the job status
      job.update(status: Job::JOB_STATUS_PROCESSING)

      # Run the import for the uploaded file
      success = nil
      errors = []

      job.file.open do |file|
        begin
          zip_importer = Import::ZipHelper.new
          success, errors = zip_importer.import_zip(file)
        rescue StandardError => error
          errors = [error]
        end
      end

      # Remove duplicate records, if specified
      remove_duplicates job if success

      # Update the job status
      if success && errors.empty?
        job.update(status: Job::JOB_STATUS_COMPLETED)
      else
        log_errors errors
        job.update(status: Job::JOB_STATUS_FAILED)
      end
    end

    private

    def log_errors(errors)
      errors.each do |error|
        Rails.logger.error (["#{self.class} - #{error.class}: #{error.message}", error.backtrace]).join("\n")
      end
    end

    def remove_duplicates(job)
      return unless job.extra['filenames'].present?

      service = ImportAnalyze::Import.new
      service.remove_duplicates job.project_id, job.extra['filenames']
    end

  end
end