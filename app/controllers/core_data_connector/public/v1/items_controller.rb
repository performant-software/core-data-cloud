module CoreDataConnector
  module Public
    module V1
      class ItemsController < PublicController
        # Includes
        include NameableController
        include UnauthenticateableController
        include UserDefinedFields::Queryable

        # Preloads
        preloads project_model: :user_defined_fields
        preloads :source_names
        preloads web_identifiers: :web_authority, only: :show
      end
    end
  end
end