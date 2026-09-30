module CoreDataConnector
  module Public
    module V1
      module OwnableSerializer
        extend ActiveSupport::Concern

        included do
          index_attributes(:project_model_uuid) { |item| item.project_model&.uuid }
          show_attributes(:project_model_uuid) { |item| item.project_model&.uuid }
        end
      end
    end
  end
end
