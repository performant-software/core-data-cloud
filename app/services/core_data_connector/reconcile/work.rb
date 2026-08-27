module CoreDataConnector
  module Reconcile
    module Work
      extend ActiveSupport::Concern

      class_methods do
        def preloads
          [:primary_name, :source_names]
        end
      end

      included do
        # Includes
        include Base

        # Search attributes
        reconcile_attribute :name

        reconcile_attribute(:names) do
          source_names.map(&:name)
        end
      end

    end
  end
end