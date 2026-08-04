module CoreDataConnector
  class PlaceLayersSerializer < BaseSerializer
    index_attributes :id, :name, :layer_type, :content, :url
    show_attributes :id, :name, :layer_type, :content, :url
  end
end