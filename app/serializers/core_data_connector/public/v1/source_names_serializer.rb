module CoreDataConnector
  module Public
    module V1
      class SourceNamesSerializer < BaseSerializer
        index_attributes :id, :primary
        index_attributes(:name) { |source_name| { name: source_name.name } }

        show_attributes :id, :primary
        show_attributes(:name) { |source_name| { name: source_name.name } }
      end
    end
  end
end
