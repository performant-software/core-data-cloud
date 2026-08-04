module CoreDataConnector
  module Search
    module Item
      extend ActiveSupport::Concern

      class_methods do
        def preloads
          [:primary_name, :source_names]
        end
      end

      included do
        # Includes
        include Base

        # Search attributes
        search_attribute :name, facet: true
        search_attribute :faircopy_cloud_id

        search_attribute(:names, facet: true) do
          source_names.map(&:name)
        end
      end

    end
  end
end