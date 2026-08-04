module CoreDataConnector
  module Public
    module V1
      module TypeableSerializer
        extend ActiveSupport::Concern

        included do
          index_attributes(:project_model_relationship_uuid) { |item| relationship_uuid(item) }
          index_attributes(:project_model_relationship_inverse) { |item| relationship_inverse(item) }

          protected

          def self.relationship_inverse(item)
            !item.relationships.empty?
          end

          def self.relationship_uuid(item)
            if !item.relationships.empty?
              item.relationships.map{ |r| r.project_model_relationship.uuid }.first
            elsif !item.related_relationships.empty?
              item.related_relationships.map { |r| r.project_model_relationship.uuid }.first
            end
          end
        end
      end
    end
  end
end