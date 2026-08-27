module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class ItemsSerializer < Base
          include TypeableSerializer

          annotation_attributes(:id) { |item| "#{base_url}/items/#{item.uuid}" }
          annotation_attributes(:record_id) { |item| item.id }
          annotation_attributes(:title) { |item| item.name }
          annotation_attributes(:type) { 'Item' }
          annotation_attributes :uuid, user_defined: UserDefinedSerializer
        end
      end
    end
  end
end