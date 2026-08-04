module CoreDataConnector
  class Item < ApplicationRecord
    # Includes
    include DisplayNameable
    include Export::Item
    include FccImportable
    include Identifiable
    include ImportAnalyze::Item
    include Manifestable
    include Mergeable
    include Nameable
    include Ownable
    include Reconcile::Item
    include Relateable
    include UserDefinedFields::Fieldable
    include Search::Item
    include Auditable

    # Audit logging
    track_changes

    # Nameable table
    name_table :source_names, as: :nameable

    # Delegates
    delegate :name, to: :primary_name, allow_nil: true

    # User defined fields parent
    resolve_defineable -> (item) { item.project_model }
  end
end
