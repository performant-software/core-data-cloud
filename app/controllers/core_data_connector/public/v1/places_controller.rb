module CoreDataConnector
  module Public
    module V1
      class PlacesController < PublicController
        # Includes
        include NameableController
        include UnauthenticateableController
        include UserDefinedFields::Queryable

        # Joins
        joins :primary_name

        # Preloads
        preloads :primary_name
        preloads :place_names, :place_geometry
        preloads project_model: :user_defined_fields
        preloads :place_layers, only: :show
        preloads web_identifiers: :web_authority, only: :show

        # Search attributes
        search_attributes :name
      end
    end
  end
end