module CoreDataConnector
  module Public
    module V0
      class WorksSerializer < BaseSerializer
        include TypeableSerializer
        include UserDefineableSerializer

        index_attributes :uuid, primary_name: SourceNamesSerializer

        index_attributes(:source_titles) do |work|
          serializer = SourceNamesSerializer.new
          serializer.render_index(work.source_names)
        end

        show_attributes :uuid, primary_name: SourceNamesSerializer, web_identifiers: WebIdentifiersSerializer

        show_attributes(:source_titles) do |work|
          serializer = SourceNamesSerializer.new
          serializer.render_index(work.source_names)
        end
      end
    end
  end
end