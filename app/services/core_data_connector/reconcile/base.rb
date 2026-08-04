module CoreDataConnector
  module Reconcile
    module Base
      extend ActiveSupport::Concern

      class_methods do

        def apply_reconcile_preloads(records)
          # Preload any associations from the concrete class
          if self.respond_to?(:preloads) && preloads.present?
            Preloader.new(
              records: records,
              associations: preloads
            ).call
          end
        end

        def for_reconcile(project_id, &block)
          # Base query
          query = all_records_by_project(project_id)

          # Concrete class query
          query = search_query(query) if self.respond_to?(:search_query)

          query.find_in_batches(batch_size: 1000) do |records|
            # Apply the preloads for the current batch
            apply_reconcile_preloads records

            # Call the block for the current batch
            block.call(records)
          end
        end

        def reconcile_attribute(*attrs, &block)
          name, options = attrs

          @reconcile_attrs ||= []
          @reconcile_attrs << { name: name, block: block}.merge(options || {})
        end

        def reconcile_attributes
          @reconcile_attrs
        end

      end

      included do
        # Include the ID attributes as a string by default
        reconcile_attribute(:id) { uuid }
        reconcile_attribute(:record_id) { id.to_s }
        reconcile_attribute(:project_model_id) { project_model_id.to_s }
        reconcile_attribute :uuid
        reconcile_attribute(:type) { self.class.to_s }

        def to_reconcile_json
          hash = {}

          # Add attributes defined by the concrete-class
          self.class.reconcile_attributes.each do |attr|
            name = attr[:name]

            # Extract the value for the attribute
            if attr[:block].present?
              value = instance_exec &attr[:block]
            else
              value = self.send(attr[:name])
            end

            # Skip the property of the value is empty
            next if value.nil?

            # Add the name/value pair to the JSON
            hash[name] = value
          end

          hash
        end
      end

    end
  end
end