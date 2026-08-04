module CoreDataConnector
  module Public
    module V0
      class TaxonomiesSerializer < BaseSerializer
        include TypeableSerializer
        include UserDefineableSerializer

        index_attributes :uuid, :name
        show_attributes :uuid, :name
      end
    end
  end
end