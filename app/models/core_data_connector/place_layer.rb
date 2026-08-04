module CoreDataConnector
  class PlaceLayer < ApplicationRecord
    LAYER_TYPES = %w(geojson raster georeference)

    # Includes
    include Auditable

    # Audit logging
    track_changes root: ->(place_layer) { place_layer.place }, ignore: [:place_id]

    # Relationships
    belongs_to :place

    # Validations
    validates :name, presence: true
    validates :layer_type, inclusion: { in: LAYER_TYPES }
    validates :content, presence: true, if: -> { url.blank? }
    validates :url, presence: true, if: -> { content.blank? }
  end
end