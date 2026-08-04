module CoreDataConnector
  class TaxonomiesController < ApplicationController
    # Includes
    include ManifestableController
    include MergeableController
    include OwnableController
    include RelatedColumnable
    include UserDefinedFields::Queryable

    # Search attributes
    search_attributes :name
  end
end
