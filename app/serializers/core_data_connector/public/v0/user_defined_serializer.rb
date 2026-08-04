module CoreDataConnector
  module Public
    module V0
      class UserDefinedSerializer < BaseSerializer
        def render_index(item)
          serialized = {}

          # Retrieve all of the user-defined fields on the passed item
          render_user_defined item, item.project_model.user_defined_fields, serialized

          # Only render relationships for an annotation route
          return serialized unless options[:nested_resource].to_s.to_bool

          # Retrieve all of the user-defined fields on the relationships for the passed item
          item.relationships.each do |relationship|
            user_defined_fields = relationship.project_model_relationship.user_defined_fields
            render_user_defined relationship, user_defined_fields, serialized
          end

          # Retrieve all of the user-defined fields on the related relationships for the passed item
          item.related_relationships.each do |relationship|
            user_defined_fields = relationship.project_model_relationship.user_defined_fields
            render_user_defined relationship, user_defined_fields, serialized
          end

          serialized
        end

        def render_user_defined(item, fields, hash)
          return if fields.nil?

          fields.each do |field|
            next unless item.user_defined

            value = item.user_defined[field.uuid]
            next if value.nil?

            hash[field.uuid] = {
              label: field.column_name,
              value: value
            }
          end
        end
      end
    end
  end
end