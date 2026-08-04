module CoreDataConnector
  module MergeableController
    extend ActiveSupport::Concern

    included do
      # Search methods
      search_methods :search_merged_uuid

      def merge
        render json: { errors: [I18n.t('errors.mergeable.ids')] }, status: :bad_request and return unless params[:ids].present?

        item = item_class.new(prepare_params)
        authorize_create item

        items = item_class
                  .preload(ImportAnalyze::Helper::PRELOADS)
                  .where(id: params[:ids])

        authorize_destroy items

        begin
          service = Merge::Merger.new
          service.merge(item, items)

          errors = item.errors
        rescue StandardError => exception
          errors = [exception]
        end

        if errors.nil? || errors.empty?
          render json: build_show_response(item), status: :ok
        else
          render json: { errors: errors }, status: :bad_request
        end
      end

      private

      def authorize_create(item)
        policy = Pundit.policy!(current_user, item)
        policy.create?
      end

      def authorize_destroy(items)
        items.each do |item|
          policy = Pundit.policy!(current_user, item)
          policy.destroy?
        end
      end

      def search_merged_uuid(query)
        return query unless params[:search].present?

        uuid_query = item_class.where(
          RecordMerge
            .where(RecordMerge.arel_table[:mergeable_id].eq(item_class.arel_table[:id]))
            .where(mergeable_type: item_class.to_s)
            .where(merged_uuid: params[:search])
            .arel
            .exists
        )

        if query == item_class.all
          query.merge(uuid_query)
        else
          query.or(uuid_query)
        end
      end
    end
  end
end