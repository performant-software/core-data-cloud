module CoreDataConnector
  class VersionsSerializer < BaseSerializer
    index_attributes :id, :uuid, :event, :item_id, :request_uuid, :created_at, user: UsersSerializer

    index_attributes(:record_type) { |version| version.item_type.demodulize }

    index_attributes(:roots) do |version, _current_user, options|
      Array(version.roots).map { |root| options[:root_data].call(root) }
    end
    index_attributes(:attributes) { |version, _current_user, options| options[:attribute_changes].call(version) }
    index_attributes(:user_defined) { |version, _current_user, options| options[:user_defined_changes].call(version) }
    index_attributes(:metadata) { |version| version.meta }

    show_attributes(*index_attributes)
  end
end