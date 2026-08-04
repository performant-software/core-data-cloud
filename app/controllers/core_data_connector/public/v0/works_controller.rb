module CoreDataConnector
  module Public
    module V0
      class WorksController < PublicController
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