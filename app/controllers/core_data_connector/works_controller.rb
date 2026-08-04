module CoreDataConnector
  class WorksController < ApplicationController
    # Includes
    include ManifestableController
    include MergeableController
    include NameableController
    include OwnableController
    include RelatedColumnable
    include UserDefinedFields::Queryable

    # Preloads
    preloads :source_names, only: :show

    # Search attributes
    search_attributes :name
  end
end
