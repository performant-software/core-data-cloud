module CoreDataConnector
  class MediaContentsSerializer < BaseSerializer
    include OwnableSerializer
    include TripleEyeEffable::ResourceableSerializer
    include UserDefinedFields::FieldableSerializer

    index_attributes :id, :name, :content_warning
    show_attributes :id, :name, :content_warning
  end
end