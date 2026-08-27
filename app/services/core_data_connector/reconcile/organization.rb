module CoreDataConnector
  module Reconcile
    module Organization
      extend ActiveSupport::Concern

      class_methods do
        def preloads
          [:primary_name, :organization_names]
        end
      end

      included do
        # Includes
        include Base

        # Search attributes
        reconcile_attribute :name
        reconcile_attribute :description

        reconcile_attribute(:names) do
          organization_names.map(&:name)
        end
      end

    end
  end
end