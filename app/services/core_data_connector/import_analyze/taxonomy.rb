module CoreDataConnector
  module ImportAnalyze
    module Taxonomy
      extend ActiveSupport::Concern

      # Includes
      include Base

      class_methods do
        def group_by_columns
          [CoreDataConnector::Taxonomy.arel_table[:name]]
        end
      end
    end
  end
end