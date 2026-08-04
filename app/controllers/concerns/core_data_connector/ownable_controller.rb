module CoreDataConnector
  module OwnableController
    extend ActiveSupport::Concern

    VIEW_ALL = 'all'
    VIEW_OWNED = 'owned'
    VIEW_SHARED = 'shared'

    included do
      search_methods :search_uuid

      protected

      def base_query
        query = super

        # For a single record, we don't need project_model_id. We'll let the policy handle authorization.
        return query if params[:id].present?

        # Return an empty set if the project_model_id is not present
        return item_class.none unless params[:project_model_id].present?

        # For an index view, we'll filter the records based on the "view" parameter, defaulting to the records
        # owned by the passed "project_model_id" parameter.
        if params[:view] == VIEW_ALL
          query.merge(item_class.all_records_by_project_model(params[:project_model_id]))
        elsif params[:view] == VIEW_OWNED
          query.merge(item_class.owned_records_by_project_model(params[:project_model_id]))
        elsif params[:view] == VIEW_SHARED
          query.merge(item_class.shared_records_by_project_model(params[:project_model_id]))
        else
          query.merge(item_class.owned_records_by_project_model(params[:project_model_id]))
        end
      end

      private

      def search_uuid(query)
        return query unless params[:search].present?

        uuid_query = item_class.where(uuid: params[:search])

        if query == item_class.all
          query.merge(uuid_query)
        else
          query.or(uuid_query)
        end
      end
    end
  end
end