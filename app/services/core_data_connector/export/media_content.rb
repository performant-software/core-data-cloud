module CoreDataConnector
  module Export
    module MediaContent
      extend ActiveSupport::Concern

      class_methods do
        def export_preloads
          [:resource_description]
        end
      end

      included do
        # Includes
        include Base

        # Export attributes
        export_attribute :project_model_id
        export_attribute :uuid
        export_attribute :name

        export_attribute(:import_url) do
          import_url || content_download_url
        end

        export_attribute :content_warning
      end
    end
  end
end