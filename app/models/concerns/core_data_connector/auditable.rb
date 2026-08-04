module CoreDataConnector
  module Auditable
    extend ActiveSupport::Concern

    class_methods do
      def track_changes(root: nil, roots: nil, **options)
        has_paper_trail(
          versions: { class_name: 'CoreDataConnector::Version' },
          meta: {
            roots: ->(record) { record.audit_roots_data },
            project_id: ->(record) { record.audit_roots.first&.project_id },
            meta: ->(record) { record.audit_metadata }
          },
          **options,
          ignore: [
            :id,
            :created_at,
            :updated_at,
            :uuid,
            :import_id,
            :project_model_id,
            :z_event_id,
            :z_instance_id,
            :z_item_id,
            :z_media_content_id,
            :z_organization_id,
            :z_person_id,
            :z_place_id,
            :z_taxonomy_id,
            :z_work_id
          ].concat(options[:ignore] || []),
        )

        after_commit :backfill_audit_roots_data, on: :create

        if roots
          define_method(:audit_roots) { Array(roots.call(self)).compact }
        elsif root
          define_method(:audit_roots) { [root.call(self)].compact }
        else
          @audit_root = true
        end
      end

      # Returns whether this model is a top-level trackable record
      def audit_root?
        @audit_root
      end
    end

    def audit_roots
      [self]
    end

    def audit_roots_data
      audit_roots.map do |record|
        {
          type: record.class.name,
          id: record.id,
          display_name: record.display_name,
          uuid: record.uuid,
          project_model_id: record.project_model_id
        }
      end
    end

    # Additional model-specific data to store alongside each version
    def audit_metadata
      nil
    end

    private

    # Fill in root data after record creation
    def backfill_audit_roots_data
      incomplete = versions.where(event: 'create').reject { |version| audit_roots_complete?(version) }
      return if incomplete.blank?

      data = self.class.find_by(id: id)&.audit_roots_data
      return if data.blank?

      versions.where(id: incomplete.map(&:id)).update_all(roots: data)
    end

    def audit_roots_complete?(version)
      roots = Array(version.roots)
      roots.present? && roots.all? { |root| root['uuid'].present? }
    end
  end
end
