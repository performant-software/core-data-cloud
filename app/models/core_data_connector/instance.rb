module CoreDataConnector
  class Instance < ApplicationRecord
    # Includes
    include DisplayNameable
    include Export::Instance
    include Identifiable
    include ImportAnalyze::Instance
    include Manifestable
    include Mergeable
    include Nameable
    include Ownable
    include Reconcile::Instance
    include Relateable
    include UserDefinedFields::Fieldable
    include Search::Instance
    include Auditable

    # Audit logging
    track_changes

    # Nameable table
    name_table :source_names, as: :nameable

    # Delegates
    delegate :name, to: :primary_name, allow_nil: true

    # User defined fields parent
    resolve_defineable -> (instance) { instance.project_model }
  end
end
