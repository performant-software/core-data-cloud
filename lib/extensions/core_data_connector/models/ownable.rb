module Extensions
  module CoreDataConnector
    module Ownable
      extend ActiveSupport::Concern

      included do
        has_one :project_item, as: :projectable, class_name: ProjectItem.to_s, required: true
        has_one :project, through: :project_item

        # Nested attributes
        accepts_nested_attributes_for :project_item, allow_destroy: true

        # Resourceable parameters
        allow_params project_item_attributes: [:id, :project_id, :_destroy]
      end
    end
  end
end
