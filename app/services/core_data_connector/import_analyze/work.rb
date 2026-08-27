module CoreDataConnector
  module ImportAnalyze
    module Work
      extend ActiveSupport::Concern

      # Includes
      include Base

      class_methods do
        def base_query
          joins(:primary_name)
        end

        def group_by_columns
          [CoreDataConnector::SourceName.arel_table[:name]]
        end
      end
    end
  end
end