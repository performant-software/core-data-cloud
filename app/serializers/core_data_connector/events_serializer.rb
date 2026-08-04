module CoreDataConnector
  class EventsSerializer < BaseSerializer
    include OwnableSerializer
    include UserDefinedFields::FieldableSerializer
    include RelatedColumnsSerializable

    index_attributes :id, :name, :description, start_date: FuzzyDates::FuzzyDateSerializer, end_date: FuzzyDates::FuzzyDateSerializer
    show_attributes :id, :name, :description, start_date: FuzzyDates::FuzzyDateSerializer, end_date: FuzzyDates::FuzzyDateSerializer
  end
end