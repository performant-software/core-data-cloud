module CoreDataConnector
  module ImportAnalyze
    module Base
      extend ActiveSupport::Concern

      class_methods do
        def base_query
          all
        end

        def group_by_columns
          # Implemented in sub-classes
        end

        def find_duplicates(project_id)
          primary_key = "#{table_name}.id"

          group_columns = [
            :project_model_id,
            *group_by_columns
          ]

          select_columns = [
            *group_columns,
            "MIN(#{primary_key}) AS primary_id",
            "ARRAY_REMOVE(ARRAY_AGG(#{primary_key}), MIN(#{primary_key})) AS duplicate_ids"
          ]

          base_query
            .select(select_columns)
            .joins(:project_model)
            .where(project_model: { project_id: project_id })
            .group(group_columns)
            .having('COUNT(*) > 1')
        end

      end
    end
  end
end