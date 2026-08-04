module CoreDataConnector
  class PersonName < ApplicationRecord
    # Includes
    include Auditable

    # Audit logging
    track_changes root: ->(person_name) { person_name.person }, ignore: [:person_id]

    # Relationships
    belongs_to :person
  end
end
