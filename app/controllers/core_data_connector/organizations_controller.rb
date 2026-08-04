module CoreDataConnector
  class OrganizationsController < ApplicationController
    # Includes
    include ManifestableController
    include MergeableController
    include NameableController
    include OwnableController
    include RelatedColumnable
    include UserDefinedFields::Queryable

    # Preloads
    preloads :organization_names, only: :show

    # Search attributes
    search_attributes :name
  end
end