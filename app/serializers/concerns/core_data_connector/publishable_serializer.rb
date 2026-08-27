module CoreDataConnector
  module PublishableSerializer
    extend ActiveSupport::Concern

    included do
      index_attributes :published
      show_attributes :published
    end
  end
end
