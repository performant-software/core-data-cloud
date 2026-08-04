module CoreDataConnector
  module Public
    module V0
      module TypeableSerializer
        extend ActiveSupport::Concern

        included do
          index_attributes(:relationship_type) { |item, current_user, options| relationship_type(item, options) }

          protected

          def self.relationship_type(item, options)
            if options[:nested_resource].to_s.to_bool
              if !item.relationships.empty?
                item.relationships.map{ |r| r.project_model_relationship.inverse_name }.first
              elsif !item.related_relationships.empty?
                item.related_relationships.map { |r| r.project_model_relationship.name }.first
              end
            end
          end
        end
      end
    end
  end
end