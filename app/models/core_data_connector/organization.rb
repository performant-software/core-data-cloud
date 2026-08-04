module CoreDataConnector
  class Organization < ApplicationRecord
    # Includes
    include DisplayNameable
    include Export::Organization
    include Identifiable
    include ImportAnalyze::Organization
    include Manifestable
    include Mergeable
    include Nameable
    include Ownable
    include Reconcile::Organization
    include Relateable
    include Search::Organization
    include Auditable
    include UserDefinedFields::Fieldable

    # Audit logging
    track_changes

    # Delegates
    delegate :name, to: :primary_name, allow_nil: true

    # Nameable table
    name_table :organization_names

    # User defined fields parent
    resolve_defineable -> (organization) { organization.project_model }
  end
end