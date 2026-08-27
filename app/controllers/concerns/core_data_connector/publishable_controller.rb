module CoreDataConnector
  module PublishableController
    extend ActiveSupport::Concern

    included do
      def publish
        item = find_record(item_class)
        authorize item, :publish?

        if item.update_published(published_param)
          item = prepare_item(item)
          preloads(item)

          render json: build_show_response(item), status: :ok
        else
          render json: { errors: item.errors }, status: :bad_request
        end
      end

      private

      def published_param
        ActiveModel::Type::Boolean.new.cast(params[:published]) || false
      end

    end
  end
end
