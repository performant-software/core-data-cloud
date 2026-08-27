module CoreDataConnector
  class RecordMergesSerializer < BaseSerializer
    index_attributes :id, :merged_uuid, :merged_name, :created_at
    show_attributes :id, :merged_uuid, :merged_name, :created_at
  end
end