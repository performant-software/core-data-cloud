module CoreDataConnector
  class OrganizationName < ApplicationRecord
    # Includes
    include Auditable

    # Audit logging
    track_changes root: ->(organization_name) { organization_name.organization }, ignore: [:organization_id]

    # Relationships
    belongs_to :organization
  end
end
