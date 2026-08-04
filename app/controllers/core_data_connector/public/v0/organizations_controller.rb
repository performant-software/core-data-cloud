module CoreDataConnector
  module Public
    module V0
      class OrganizationsController < PublicController
        # Includes
        include NameableController
        include UnauthenticateableController
        include UserDefinedFields::Queryable

        # Preloads
        preloads :organization_names, only: :show
        preloads project_model: :user_defined_fields

        # Search attributes
        search_attributes :name
      end
    end
  end
end