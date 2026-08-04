module CoreDataConnector
  module Search
    module Event
      extend ActiveSupport::Concern

      class_methods do
        def preloads
          [:start_date, :end_date]
        end
      end

      included do
        # Includes
        include Base

        # Search attributes
        search_attribute :name, facet: true
        search_attribute :description

        search_attribute(:start_date) do
          resolve_date start_date
        end

        search_attribute(:end_date) do
          resolve_date end_date
        end

        search_attribute(:start_year, facet: true) do
          resolve_year start_date
        end

        search_attribute(:end_year, facet: true) do
          resolve_year end_date
        end

        private

        def resolve_date(date)
          return [] unless date.present?

          [date.start_date&.to_time&.to_i, date.end_date&.to_time&.to_i]
        end

        def resolve_year(date)
          return [] unless date.present?

          [date.start_date&.strftime('%Y')&.to_i, date.end_date&.strftime('%Y')&.to_i]
        end

      end
    end
  end
end