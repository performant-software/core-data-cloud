module CoreDataConnector
  class PeopleSerializer < BaseSerializer
    include OwnableSerializer
    include UserDefinedFields::FieldableSerializer
    include RelatedColumnsSerializable

    index_attributes :id, :first_name, :middle_name, :last_name
    show_attributes :id, :first_name, :middle_name, :last_name, :biography, person_names: [:id, :first_name, :middle_name, :last_name, :primary]
  end
end