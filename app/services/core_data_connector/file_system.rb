require 'zip'

IGNORE_PATTERN = /\.DS_Store|__MACOSX|(^|\/)\._/

module CoreDataConnector
  class FileSystem

    # Creates a temporary directory in the Rails root/tmp folder
    def self.create_directory
      directory = "#{Rails.root}/tmp/#{SecureRandom.urlsafe_base64}"

      FileUtils.mkdir_p(directory) unless File.exist? directory

      directory
    end

    def self.create_zip(directory, zip_filename)
      zip_filepath = File.join(directory, zip_filename)
      file_pattern = File.join(directory, '*.csv')

      Zip::File.open(zip_filepath, create: true) do |zipfile|
        Dir.glob(file_pattern).each do |filepath|
          filename = File.basename(filepath)
          zipfile.add(filename, File.join(directory, filename))
        end
      end
    end

    # Extracts the passed zip file to the passed destination
    def self.extract_zip(zip_file, destination)
      Zip::File.open(zip_file) do |zipfile|
        zipfile.each do |entry|
          # Ignore directories
          next unless entry.file?

          # Ignore MacOS archive
          next if entry.name =~ IGNORE_PATTERN

          # Extract the file
          zipfile.extract(entry, File.join(destination, entry.name))
        end
      end
    end

    # Removes the passed directory
    def self.remove_directory(directory)
      FileUtils.rm_rf directory
    end

  end
end