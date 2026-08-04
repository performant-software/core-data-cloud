module CoreDataConnector
  class TaxonomiesSerializer < BaseSerializer
    include OwnableSerializer
    include UserDefinedFields::FieldableSerializer
    include RelatedColumnsSerializable

    index_attributes :id, :name
    show_attributes :id, :name
  end
end
