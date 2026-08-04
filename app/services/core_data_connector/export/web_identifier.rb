module CoreDataConnector
  module Export
    module WebIdentifier
      extend ActiveSupport::Concern

      class_methods do
        def export_preloads
          [:identifiable]
        end
      end

      included do
        # Includes
        include Base

        # Export attributes
        export_attribute :web_authority_id

        export_attribute(:identifiable_uuid) do
          identifiable&.uuid
        end

        export_attribute :identifiable_type
        export_attribute :identifier
      end
    end
  end
end