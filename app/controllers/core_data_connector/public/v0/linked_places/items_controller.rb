module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class ItemsController < LinkedPlacesController
          # Includes
          include NameableController
          include UnauthenticateableController
          include UserDefinedFields::Queryable

          # Preloads
          preloads project_model: :user_defined_fields
          preloads :source_names, only: :show
        end
      end
    end
  end
end