module CoreDataConnector
  module ImportAnalyze
    module Event
      extend ActiveSupport::Concern

      # Includes
      include Base

      class_methods do
        def group_by_columns
          [CoreDataConnector::Event.arel_table[:name]]
        end
      end
    end
  end
end