module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class PlacesSerializer < Base
          annotation_attributes(:id) { |place| identifier place }
          annotation_attributes(:record_id) { |place| place.id }
          annotation_attributes(:uuid) { |place| place.uuid }
          annotation_attributes(:title) { |place| place.name }
          annotation_attributes(:type) { 'Place' }
          annotation_attributes(:geometry) { |place| place.place_geometry&.to_geojson }
          annotation_attributes user_defined: UserDefinedSerializer

          index_attributes(:@id) { |place| identifier place }
          index_attributes(:type) { 'Place' }
          index_attributes(:properties) { |place| { ccode: [], title: place.name, record_id: place.id, uuid: place.uuid } }
          index_attributes(:geometry) { |place| place.place_geometry&.to_geojson }
          index_attributes(:names) { |place| place.place_names.map{ |name| { toponym: name.name } } }

          show_attributes(:@id) { |place| identifier place }
          show_attributes(:type) { 'Place' }
          show_attributes(:properties) { |place| { ccode: [], title: place.name, record_id: place.id, uuid: place.uuid } }
          show_attributes(:geometry) { |place| place.place_geometry&.to_geojson }
          show_attributes(:names) { |place| place.place_names.map{ |name| { toponym: name.name } } }
          show_attributes user_defined: UserDefinedSerializer, place_layers: PlaceLayersSerializer, web_identifiers: WebIdentifiersSerializer

          target_attributes(:id) { |place| identifier place }
          target_attributes(:record_id) { |place| place.id }
          target_attributes(:name) { |place| place.primary_name&.name }
          target_attributes(:type) { 'Place' }
          target_attributes :uuid

          def self.identifier(place)
            "#{base_url}/places/#{place.uuid}"
          end
        end
      end
    end
  end
end