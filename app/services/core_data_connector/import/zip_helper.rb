require 'zip'

IGNORE_PATTERN = /\.DS_Store|__MACOSX|(^|\/)\._/

module CoreDataConnector
  module Import
    class ZipHelper
      def import_zip(temp_file)
        begin
          # Create the target directory
          destination = "#{Rails.root}/tmp/#{SecureRandom.urlsafe_base64}"
          FileUtils.mkdir_p(destination) unless File.exist? destination
      
          # Extract the zip file to the directory
          Zip::File.open(temp_file) do |zipfile|
            zipfile.each do |entry|
              # Ignore directories
              next unless entry.file?
      
              # Ignore MacOS archive
              next if entry.name =~ IGNORE_PATTERN
      
              # Extract the file
              zipfile.extract(entry, File.join(destination, entry.name))
            end
          end

          import_id = nil

          # Create a new importer with the temp directory and run it
          importer = CoreDataConnector::Import::Importer.new(destination)

          ActiveRecord::Base.transaction do
            import_id = importer.run
          end

          # Perform any clean up operations and close the importer
          importer.close
      
          # Remove the temporary directory
          FileUtils.rm_rf(destination)
      
          return true, [], import_id
        rescue ActiveRecord::RecordInvalid => exception
          return false, [exception]
        rescue StandardError => exception
          return false, [exception]
        end
      end
    end
  end
end