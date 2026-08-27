module CoreDataConnector
  module Public
    module V0
      module LinkedPlaces
        class InstancesSerializer < Base
          include TypeableSerializer

          annotation_attributes(:id) { |instance| "#{base_url}/instances/#{instance.uuid}" }
          annotation_attributes(:record_id) { |instance| instance.id }
          annotation_attributes(:title) { |instance| instance.name }
          annotation_attributes(:type) { 'Instance' }
          annotation_attributes :uuid, user_defined: UserDefinedSerializer
        end
      end
    end
  end
end