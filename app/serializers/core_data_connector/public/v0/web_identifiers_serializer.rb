module CoreDataConnector
  module Public
    module V0
      class WebIdentifiersSerializer < BaseSerializer
        index_attributes :id, :identifier, :extra, :web_authority_id, web_authority: [:id, :source_type]
      end
    end
  end
end