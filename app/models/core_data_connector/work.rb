module CoreDataConnector
  class Work < ApplicationRecord
    # Includes
    include DisplayNameable
    include Export::Work
    include Identifiable
    include ImportAnalyze::Work
    include Manifestable
    include Mergeable
    include Nameable
    include Ownable
    include Reconcile::Work
    include Relateable
    include UserDefinedFields::Fieldable
    include Search::Work
    include Auditable

    # Audit logging
    track_changes

    # Nameable table
    name_table :source_names, as: :nameable

    # Delegates
    delegate :name, to: :primary_name, allow_nil: true

    # User defined fields parent
    resolve_defineable -> (work) { work.project_model }
  end
end
