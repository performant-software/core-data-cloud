module CoreDataConnector
  module Search
    module Place
      extend ActiveSupport::Concern

      class_methods do
        def preloads
          [:primary_name, :place_names, :place_geometry]
        end

        def search_query(query)
          query.merge(self.with_search_geometry)
        end
      end

      included do
        # Includes
        include Base

        # Search attributes
        search_attribute :name, facet: true

        search_attribute(:names, facet: true) do
          place_names.map(&:name)
        end

        search_attribute(:geometry) do |options|
          if options[:polygons] && self.respond_to?(:simplified_geometry) && simplified_geometry.present?
            Geometry.to_geojson(self.simplified_geometry)
          elsif self.respond_to?(:geometry_center) && geometry_center.present?
            Geometry.to_geojson(geometry_center)
          end
        end

        search_attribute(:properties) do
          place_geometry&.properties
        end

        search_attribute(:coordinates) do
          # Return if the "geometry_center" attribute is not defined
          next unless self.respond_to?(:geometry_center) && geometry_center.present?

          [geometry_center.y, geometry_center.x]
        end
      end
    end
  end
end