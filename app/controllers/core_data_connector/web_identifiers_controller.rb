module CoreDataConnector
  class WebIdentifiersController < ApplicationController
    # Search attributes
    search_attributes :key

    # Preloads
    preloads :web_authority

    # Joins
    joins :web_authority

    protected

    def base_query
      return WebIdentifier.none unless (params[:identifiable_id].present? && params[:identifiable_type].present?) || params[:id].present?

      query = super

      if params[:identifiable_id].present? && params[:identifiable_type].present?
        query = query
                  .where(identifiable_id: params[:identifiable_id])
                  .where(identifiable_type: params[:identifiable_type])
      end

      query
    end
  end
end