module CoreDataConnector
  module Public
    module V1
      class EventsController < PublicController
        # Includes
        include UnauthenticateableController
        include UserDefinedFields::Queryable

        # Preloads
        preloads project_model: :user_defined_fields
        preloads :start_date, :end_date

        # Joins
        joins Event.start_date_join, Event.end_date_join

        # Search attributes
        search_attributes :name, :description

        protected

        def apply_filters(query)
          query = super

          query = filter_min_year(query)

          query = filter_max_year(query)

          query
        end

        private

        def filter_max_year(query)
          return query unless params[:max_year].present?

          date = Date.new(params[:max_year].to_i, 12, 31)

          query.where('( start_date.start_date <= ? OR end_date.start_date <= ? )', date, date)
        end

        def filter_min_year(query)
          return query unless params[:min_year].present?

          date = Date.new(params[:min_year].to_i, 1, 1)

          query.where('( start_date.end_date >= ? OR end_date.end_date >= ? )', date, date)
        end
      end
    end
  end
end