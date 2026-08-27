module CoreDataConnector
  module Public
    module V0
      class PlaceGeometriesSerializer < BaseSerializer
        index_attributes geometry_json: -> (pg, *rest) { pg.to_geojson }
        show_attributes geometry_json: -> (pg, *rest) { pg.to_geojson }
      end
    end
  end
end