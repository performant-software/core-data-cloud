module CoreDataConnector
  class PlaceGeometriesSerializer < BaseSerializer
    index_attributes :id, :properties, geometry_json: -> (pg, *rest) { pg.to_geojson }
    show_attributes :id, :properties, geometry_json: -> (pg, *rest) { pg.to_geojson }
  end
end