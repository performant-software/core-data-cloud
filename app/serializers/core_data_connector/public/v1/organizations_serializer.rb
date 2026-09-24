module CoreDataConnector
  module Public
    module V1
      class OrganizationsSerializer < BaseSerializer
        include OwnableSerializer
        include TypeableSerializer
        include UserDefineableSerializer

        index_attributes :uuid, :name
        show_attributes :uuid, :name, :description, organization_names: [:id, :name, :primary], web_identifiers: WebIdentifiersSerializer
      end
    end
  end
end