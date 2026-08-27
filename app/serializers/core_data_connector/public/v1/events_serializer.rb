module CoreDataConnector
  module Public
    module V1
      class EventsSerializer < BaseSerializer
        include TypeableSerializer
        include UserDefineableSerializer

        index_attributes :uuid, :name, :description, start_date: FuzzyDates::FuzzyDateSerializer, end_date: FuzzyDates::FuzzyDateSerializer
        show_attributes :uuid, :name, :description, start_date: FuzzyDates::FuzzyDateSerializer, end_date: FuzzyDates::FuzzyDateSerializer, web_identifiers: WebIdentifiersSerializer
      end
    end
  end
end