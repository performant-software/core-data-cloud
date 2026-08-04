module CoreDataConnector
  module ImportAnalyze
    module MediaContent
      extend ActiveSupport::Concern

      # Includes
      include Base

      class_methods do
        def group_by_columns
          [CoreDataConnector::MediaContent.arel_table[:name]]
        end
      end
    end
  end
end