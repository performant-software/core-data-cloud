module CoreDataConnector
  module Public
    module V1
      class WebIdentifiersSerializer < BaseSerializer
        index_attributes :identifier, :extra, :web_authority_id, web_authority: [:source_type]
      end
    end
  end
end