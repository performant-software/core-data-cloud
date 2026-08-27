module CoreDataConnector
  module Public
    module V1
      class PlacesSerializer < BaseSerializer
        include TypeableSerializer
        include UserDefineableSerializer

        index_attributes :uuid, :name, place_geometry: PlaceGeometriesSerializer
        show_attributes :uuid, :name, place_names: [:name, :primary], place_geometry: PlaceGeometriesSerializer,
                        place_layers: PlaceLayersSerializer, web_identifiers: WebIdentifiersSerializer
      end
    end
  end
end
