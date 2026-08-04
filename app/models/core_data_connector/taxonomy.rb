module CoreDataConnector
  class Taxonomy < ApplicationRecord
    # Includes
    include DisplayNameable
    include Export::Taxonomy
    include Identifiable
    include ImportAnalyze::Taxonomy
    include Manifestable
    include Mergeable
    include Ownable
    include Reconcile::Taxonomy
    include Relateable
    include UserDefinedFields::Fieldable
    include Search::Taxonomy
    include Auditable

    # Audit logging
    track_changes

    # User defined fields parent
    resolve_defineable -> (taxonomy) { taxonomy.project_model }
  end
end
