module CoreDataConnector
  module Export
    module Base
      extend ActiveSupport::Concern

      class_methods do
        def export_attribute(*attrs, &block)
          name, options = attrs

          @export_attrs ||= []
          @export_attrs << { name: name, block: block }.merge(options || {})
        end

        def export_attributes
          @export_attrs
        end
      end

      included do
        def to_export_csv(user_defined_fields)
          hash = {}

          # Add attributes defined by the concrete-class
          self.class.export_attributes.each do |attr|
            name = attr[:name]

            # Extract the value for the attribute
            if attr[:block].present?
              value = instance_eval(&attr[:block])
            else
              value = self.send(attr[:name])
            end

            # Add the name/value pair to the CSV
            hash[name] = value
          end

          # Add user-defined field values
          add_user_defined_fields(hash, user_defined_fields)

          hash
        end

        private

        def add_user_defined_fields(hash, user_defined_fields)
          return unless user_defined_fields.present? && self.respond_to?(:user_defined) && user_defined.present?

          user_defined_fields.each do |user_defined_field|
            key = ImportAnalyze::Helper.uuid_to_column_name(user_defined_field.uuid)
            value = user_defined[user_defined_field.uuid]

            if user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:fuzzy_date]
              value = value.nil? ? '' : value.to_json
            elsif user_defined_field.data_type == UserDefinedFields::UserDefinedField::DATA_TYPES[:select] && user_defined_field.allow_multiple?
              value = value&.to_json
            end

            hash[key] = value
          end
        end
      end
    end
  end
end