module CoreDataConnector
  class Version < ApplicationRecord
    include PaperTrail::VersionConcern
    self.table_name = 'core_data_connector_versions'

    # Relationships
    has_one :user, foreign_key: :id, primary_key: :whodunnit

    def self.for_record(record)
      where('roots @> ?', [{ type: record.class.name, id: record.id }].to_json)
    end
  end
end
