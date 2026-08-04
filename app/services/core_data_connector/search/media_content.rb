module CoreDataConnector
  module Search
    module MediaContent
      extend ActiveSupport::Concern

      included do
        # Includes
        include Base

        # Search attributes
        search_attribute :name
        search_attribute :content_warning

        search_attribute(:thumbnail) do
          content_thumbnail_url
        end
      end

    end
  end
end