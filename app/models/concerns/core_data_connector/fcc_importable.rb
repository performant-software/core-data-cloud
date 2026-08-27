module CoreDataConnector
  module FccImportable
    extend ActiveSupport::Concern

    included do
      # Generate the full URL for the record's CSV files in FairCopy.cloud
      def faircopy_cloud_url
        project = project_model.project
        return nil unless project_model.id == project.faircopy_cloud_project_model_id

        # We assume that if a project ID is configured, that means we should use it; in other words, use the FCC2 URL format
        if project.faircopy_cloud_project_id?
          return "#{project.faircopy_cloud_url}/#{project.faircopy_cloud_project_id}/tei_documents/#{faircopy_cloud_id}/csv"
        end

        "#{project.faircopy_cloud_url}/documents/#{faircopy_cloud_id}/csv"
      end
    end
  end
end