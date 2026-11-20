module CoreDataConnector
  class ExportJsonJob < ApplicationJob

    def perform(job_id)
      job = Job.find(job_id)

      # Update the job status
      job.update(status: Job::JOB_STATUS_PROCESSING)

      # Run the export for the project
      success = nil
      errors = []

      begin
        # Create the temporary directory
        directory = FileSystem.create_directory
        filename = "#{job.project.name.gsub(/\s+/, "")}-json.zip"

        # Run the exporter to generate the JSON files
        exporter = Export::JsonExporter.new(job.project_id, base_url: job.extra['base_url'])
        exporter.run(directory)

        # Create a zip file of the JSON files (including nested directories) in the passed directory
        FileSystem.create_zip directory, filename, pattern: '*.json'

        # Attach the file to the job
        zippath = File.join(directory, filename)
        job.file.attach(io: File.open(zippath), filename: filename)

        success = true
      rescue StandardError => error
        errors = [error]
        success = false

        log_error error
      ensure
        # Remove the temporary directory
        FileSystem.remove_directory directory
      end

      # Update the job status
      if success && errors.empty?
        job.update(status: Job::JOB_STATUS_COMPLETED)
      else
        job.update(status: Job::JOB_STATUS_FAILED)
      end
    end

    private

    def log_error(error)
      Rails.logger.error (["#{self.class} - #{error.class}: #{error.message}", error.backtrace]).join("\n")
    end

  end
end
