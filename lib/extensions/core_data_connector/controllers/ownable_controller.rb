module Extensions
  module CoreDataConnector
    module OwnableController
      extend ActiveSupport::Concern

      included do
        # Preloads
        preloads :project_item, :project
      end
    end
  end
end
