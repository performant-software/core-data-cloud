module CoreDataConnector
  module Public
    module V1
      class InstancesSerializer < BaseSerializer
        include TypeableSerializer
        include UserDefineableSerializer

        index_attributes :uuid, :name

        # Legacy attributes
        index_attributes primary_name: SourceNamesSerializer

        index_attributes(:source_titles) do |instance|
          serializer = SourceNamesSerializer.new
          serializer.render_index(instance.source_names)
        end

        show_attributes :uuid, :name, source_names: [:name, :primary], web_identifiers: WebIdentifiersSerializer

        # Legacy attributes
        show_attributes primary_name: SourceNamesSerializer

        show_attributes(:source_titles) do |instance|
          serializer = SourceNamesSerializer.new
          serializer.render_index(instance.source_names)
        end
      end
    end
  end
end