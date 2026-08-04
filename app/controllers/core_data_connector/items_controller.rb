module CoreDataConnector
  class ItemsController < ApplicationController
    # Includes
    include Http::Requestable
    include ManifestableController
    include MergeableController
    include NameableController
    include OwnableController
    include RelatedColumnable
    include UserDefinedFields::Queryable

    # Preloads
    preloads :source_names, only: :show

    # Search attributes
    search_attributes :name

    def analyze_import
      item = find_record(item_class)
      authorize item

      errors = nil
      data = nil

      service = ImportAnalyze::Helper.new

      begin
        # Download the zip file from FairCopy.cloud
        send_request(item.faircopy_cloud_url, followlocation: true) do |contents|
          # Write the contents to a temporary file
          file = Tempfile.new
          file.binmode
          file.write(contents)
          file.rewind

          data = service.analyze(file, current_user)
        end
      rescue StandardError => error
        errors = [error]

        # Log the error
        log_error(error)
      end

      if errors.nil? || errors.empty?
        render json: data, status: :ok
      else
        render json: { errors: errors }, status: :bad_request
      end
    end

    def import
      item = find_record(item_class)
      authorize item

      begin
        service = ImportAnalyze::Helper.new
        errors = service.import(params[:files], current_user, item.project_model.project_id)
      rescue StandardError => error
        errors = [error]
      end

      # Log any errors
      errors.each { |e| log_error(e) } if errors.present?

      if errors.nil? || errors.empty?
        render json: { }, status: :ok
      else
        render json: { errors: errors }, status: :unprocessable_entity
      end
    end
  end
end
