module CoreDataConnector
  module Export
    module Place
      extend ActiveSupport::Concern

      class_methods do
        def export_query
          self.all.with_centroid
        end

        def export_preloads
          [:ordered_names]
        end
      end

      included do
        # Includes
        include Base
        include Nameable

        # Export attributes
        export_attribute :project_model_id
        export_attribute :uuid
        export_attribute(:name) { format_name }
        export_attribute(:latitude) { geometry_center&.y }
        export_attribute(:longitude) { geometry_center&.x }
        export_attribute(:properties) do
          JSON.generate(place_geometry&.properties) if place_geometry&.properties
        end
      end
    end
  end
end