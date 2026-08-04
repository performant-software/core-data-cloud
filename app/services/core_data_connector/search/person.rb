module CoreDataConnector
  module Search
    module Person
      extend ActiveSupport::Concern

      class_methods do
        def preloads
          [:primary_name, :person_names]
        end
      end

      included do
        # Includes
        include Base

        # Search attributes
        search_attribute :biography

        search_attribute(:name, facet: true) do
          create_name primary_name
        end

        search_attribute(:names, facet: true) do
          person_names.map { |n| create_name(n) }
        end

        def create_name(person_name)
          [person_name.first_name, person_name.middle_name, person_name.last_name].compact.join(' ')
        end

      end
    end
  end
end