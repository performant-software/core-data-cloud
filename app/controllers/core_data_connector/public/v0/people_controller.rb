module CoreDataConnector
  module Public
    module V0
      class PeopleController < PublicController
        # Includes
        include NameableController
        include UnauthenticateableController
        include UserDefinedFields::Queryable

        # Preloads
        preloads :person_names, only: :show
        preloads project_model: :user_defined_fields

        # Search attributes
        search_attributes :first_name, :middle_name, :last_name
      end
    end
  end
end