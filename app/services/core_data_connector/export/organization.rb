module CoreDataConnector
  module Export
    module Organization
      extend ActiveSupport::Concern

      class_methods do
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
        export_attribute :description
      end
    end
  end
end