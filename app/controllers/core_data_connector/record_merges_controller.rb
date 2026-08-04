module CoreDataConnector
  class RecordMergesController < ApplicationController
    # Search attributes
    search_attributes :merged_uuid

    # Actions
    before_action :bypass_authorization, only: :index
    before_action :authorize_index, only: :index

    protected

    def base_query
      return RecordMerge.none unless params[:mergeable_id].present? && params[:mergeable_type].present?

      RecordMerge.where(
        mergeable_id: params[:mergeable_id],
        mergeable_type: params[:mergeable_type]
      )
    end

    private

    def authorize_index
      return unless params[:mergeable_id].present? && params[:mergeable_type].present?

      klass = params[:mergeable_type].constantize
      item = klass.find(params[:mergeable_id])

      policy_class = "#{item.class.to_s}Policy".constantize
      authorize item, :show?, policy_class: policy_class
    end
  end
end