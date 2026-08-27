module CoreDataConnector
  module Reconcile
    module Place
      extend ActiveSupport::Concern

      class_methods do
        def preloads
          [:primary_name, :place_names]
        end
      end

      included do
        # Includes
        include Base

        # Search attributes
        reconcile_attribute :name

        reconcile_attribute(:names) do
          place_names.map(&:name)
        end
      end
    end
  end
end