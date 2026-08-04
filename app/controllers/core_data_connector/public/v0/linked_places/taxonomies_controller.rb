module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class TaxonomiesController < LinkedPlacesController
          # Includes
          include UnauthenticateableController

          # Preloads
          preloads project_model: :user_defined_fields

          # Search attributes
          search_attributes :name
        end
      end
    end
  end
end