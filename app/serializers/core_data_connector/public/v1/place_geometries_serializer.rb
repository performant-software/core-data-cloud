module CoreDataConnector
  module Public
    module V1
      class PlaceGeometriesSerializer < BaseSerializer
        index_attributes :properties, geometry_json: -> (pg, *rest) { pg.to_geojson }
        show_attributes :properties, geometry_json: -> (pg, *rest) { pg.to_geojson }
      end
    end
  end
end