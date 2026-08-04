module CoreDataConnector
  module Public
    module V1
      class PlaceLayersSerializer < BaseSerializer
        index_attributes :id, :name, :layer_type, :content, :url
        index_attributes(:geometry) { |layer| layer.content }

        show_attributes :id, :name, :layer_type, :content, :url
        show_attributes(:geometry) { |layer| layer.content }
      end
    end
  end
end