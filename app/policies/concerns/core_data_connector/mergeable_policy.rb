module CoreDataConnector
  module MergeablePolicy
    extend ActiveSupport::Concern

    included do
      def permitted_attributes_for_merge
        [*permitted_attributes, :uuid]
      end
    end
  end
end