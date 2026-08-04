module CoreDataConnector
  module Export
    module Taxonomy
      extend ActiveSupport::Concern

      included do
        # Includes
        include Base

        # Export attributes
        export_attribute :project_model_id
        export_attribute :uuid
        export_attribute :name
      end
    end
  end
end