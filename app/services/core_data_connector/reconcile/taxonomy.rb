module CoreDataConnector
  module Reconcile
    module Taxonomy
      extend ActiveSupport::Concern

      included do
        # Includes
        include Base

        # Search attributes
        reconcile_attribute :name
      end
    end
  end
end