module CoreDataConnector
  module OwnableSerializer
    extend ActiveSupport::Concern

    included do
      index_attributes :project_model_id, :uuid
      show_attributes :project_model_id, :uuid
    end
  end
end