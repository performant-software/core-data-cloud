module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class OrganizationsController < LinkedPlacesController
          # Includes
          include NameableController
          include UnauthenticateableController
          include UserDefinedFields::Queryable

          # Joins
          joins :primary_name

          # Preloads
          preloads :organization_names
          preloads :primary_name
          preloads project_model: :user_defined_fields

          # Search attributes
          search_attributes :name, :description
        end
      end
    end
  end
end