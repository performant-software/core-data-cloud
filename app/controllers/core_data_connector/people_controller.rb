module CoreDataConnector
  class PeopleController < ApplicationController
    # Includes
    include ManifestableController
    include MergeableController
    include NameableController
    include OwnableController
    include RelatedColumnable
    include UserDefinedFields::Queryable

    # Preloads
    preloads :person_names, only: :show

    # Search attributes
    search_attributes :first_name, :middle_name, :last_name
  end
end