module Extensions
  module CoreDataConnector
    module OwnableController
      extend ActiveSupport::Concern

      included do
        # Preloads
        preloads :project_item, :project

        def base_query
          return super unless params[:project_id]

          item_class.where(
            ProjectItem
              .where(ProjectItem.arel_table[:projectable_id].eq(item_class.arel_table[:id]))
              .where(projectable_type: item_class.to_s)
              .where(project_id: params[:project_id])
              .arel.exists
          )
        end
      end
    end
  end
end
