module CoreDataConnector
  module Export
    module Relationship
      extend ActiveSupport::Concern

      class_methods do
        def export_preloads
          [:primary_record, :related_record]
        end
      end

      included do
        # Includes
        include Base

        # Export attributes
        export_attribute :project_model_relationship_id
        export_attribute :uuid

        export_attribute(:primary_record_uuid) do
          primary_record&.uuid
        end

        export_attribute :primary_record_type

        export_attribute(:related_record_uuid) do
          related_record&.uuid
        end

        export_attribute :related_record_type
      end
    end
  end
end