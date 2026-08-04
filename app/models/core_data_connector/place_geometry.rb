module CoreDataConnector
  class PlaceGeometry < ApplicationRecord
    # Includes
    include Auditable

    # Audit logging. Geometries are too large to store in the audit log, but
    # every geometry update destroys the existing place_geometry record
    # and creates a new one, so that event should appear in the log.
    track_changes root: ->(place_geometry) { place_geometry.place },
                  ignore: [:place_id],
                  skip: [:geometry]

    # Relationships
    belongs_to :place

    # Transient attributes
    attr_accessor :geometry_json

    # Callbacks
    before_save :set_geometry

    # Returns the "geometry" as GeoJSON
    def to_geojson
      Geometry.to_geojson(self.geometry)
    end

    private

    # Sets the geometry attribute if the geometry_json attribute is provided.
    def set_geometry
      return unless self.geometry_json.present?

      json = JSON.parse(self.geometry_json)
      self.geometry = Geometry.to_postgis(json)
    end
  end
end