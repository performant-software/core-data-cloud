module CoreDataConnector
  class WebIdentifier < ApplicationRecord
    # Includes
    include Export::WebIdentifier
    include Auditable

    # Audit logging
    track_changes root: ->(web_identifier) { web_identifier.identifiable }, ignore: [:identifiable_id]

    # Relationships
    belongs_to :identifiable, polymorphic: true
    belongs_to :web_authority

    # Callbacks
    before_create :find_identifier

    # Delegates
    delegate :project, to: :web_authority, allow_nil: true
    delegate :project_id, to: :web_authority, allow_nil: true

    def self.all_records_by_project(project_id)
      WebIdentifier
        .joins(:web_authority)
        .where(web_authority: { project_id: project_id })
    end

    private

    def find_identifier
      service = Authority::Base.create_service(web_authority)
      service.before_create(self)
    end
  end
end