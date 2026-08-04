module CoreDataConnector
  module Public
    module V0
      class PeopleSerializer < BaseSerializer
        include TypeableSerializer
        include UserDefineableSerializer

        index_attributes :uuid, :first_name, :middle_name, :last_name
        show_attributes :uuid, :first_name, :middle_name, :last_name, :biography, person_names: [:id, :first_name, :middle_name, :last_name, :primary]
      end
    end
  end
end