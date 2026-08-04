module CoreDataConnector
  module ImportAnalyze
    module Person
      extend ActiveSupport::Concern

      # Includes
      include Base

      class_methods do
        def base_query
          joins(:primary_name)
        end

        def group_by_columns
          [
            CoreDataConnector::PersonName.arel_table[:last_name],
            CoreDataConnector::PersonName.arel_table[:first_name]
          ]
        end
      end
    end
  end
end