require 'rgeo/geo_json'

module CoreDataConnector
  class Geometry
    # Converts the passed PostGIS to GeoJSON
    def self.to_geojson(geometry)
      RGeo::GeoJSON.encode(geometry)
    end

    # Converts the passed GeoJSON to PostGIS
    def self.to_postgis(geometry)
      factory = RGeo::Geographic.spherical_factory(srid: 4326, buffer_resolution: 8)

      decoded = RGeo::GeoJSON.decode(geometry, geo_factory: factory, json_parser: :json)
      return decoded unless decoded.is_a?(RGeo::GeoJSON::FeatureCollection)

      # For a FeatureCollection, we'll convert that to a PostGIS GeometryCollection type
      factory.collection(decoded.instance_variable_get('@features').map(&:geometry))
    end
  end
end