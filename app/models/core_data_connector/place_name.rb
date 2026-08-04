module CoreDataConnector
  class PlaceName < ApplicationRecord
    self.primary_key = :id

    # Includes
    include Auditable

    # Audit logging
    track_changes root: ->(place_name) { place_name.place }, ignore: [:place_id]

    # Relationships
    belongs_to :place
  end
end
