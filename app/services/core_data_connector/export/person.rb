module CoreDataConnector
  module Export
    module Person
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
        export_attribute(:last_name) { format_name :last_name }
        export_attribute(:first_name) { format_name :first_name }
        export_attribute(:middle_name) { format_name :middle_name }
        export_attribute :biography
      end
    end
  end
end