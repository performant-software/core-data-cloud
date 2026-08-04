module CoreDataConnector
  module ManifestableController
    extend ActiveSupport::Concern

    included do

      def create_manifests
        item = find_record(item_class)
        authorize item

        service = Iiif::Manifest.new
        service.reset_manifests_by_type(item_class, {
          id: item.id,
          project_model_relationship_id: params[:project_model_relationship_id],
          limit: ENV['IIIF_MANIFEST_ITEM_LIMIT']
        })

        render status: :ok
      end

    end
  end
end