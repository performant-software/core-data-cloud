module CoreDataConnector
  class MediaContent < ApplicationRecord
    # Includes
    include DisplayNameable
    include Export::MediaContent
    include Identifiable
    include ImportAnalyze::MediaContent
    include Manifestable
    include Mergeable
    include Ownable
    include Publishable
    include Relateable
    include Search::MediaContent
    include Auditable
    include TripleEyeEffable::Resourceable
    include UserDefinedFields::Fieldable

    # Audit logging
    track_changes

    # Delegates
    delegate :storage_key, to: :project, allow_nil: true

    # Callbacks
    after_save :update_manifests
    before_destroy :set_manifestables, prepend: true
    after_destroy :reset_manifestables

    # User defined fields parent
    resolve_defineable -> (media_content) { media_content.project_model }

    def metadata
      fields = [{
        label: I18n.t('services.iiif.manifest.content_warning'),
        value: self[:content_warning]
      }]

      if !self.user_defined || self.user_defined.keys.count == 0
        return fields.to_json
      end

      udfs = UserDefinedFields::UserDefinedField
        .where(uuid: self.user_defined.keys)
        .order(:order)

      udfs.each do |udf|
        fields.push({
          label: udf[:column_name],
          value: self.user_defined[udf[:uuid]]
        })
      end

      fields.to_json
    end

    private

    def update_manifests
      iiif_service = Iiif::Manifest.new

      self.relationships.each { |r| update_relationship_manifests(r, iiif_service, true) }
      self.related_relationships.each { |r| update_relationship_manifests(r, iiif_service, false) }
    end

    # Resets the manifests for each record this media content was related to, removing any manifest that no longer has
    # any media contents.
    def reset_manifestables
      return if @manifestables.blank?

      service = Iiif::Manifest.new

      @manifestables.each do |manifestable|
        service.reset_manifests_by_type(manifestable[:model_class], {
          id: manifestable[:id],
          project_model_relationship_id: manifestable[:project_model_relationship_id],
          limit: ENV['IIIF_MANIFEST_ITEM_LIMIT']
        })
      end
    end

    # Tracks the records (and relationship IDs) whose manifests should be reset once this record
    # is destroyed, since the relationships will not exist afterwards
    def set_manifestables
      manifestables = self.relationships.reload.map do |r|
        [r.related_record_type, r.related_record_id, r.project_model_relationship_id]
      end

      manifestables += self.related_relationships.reload.map do |r|
        [r.primary_record_type, r.primary_record_id, r.project_model_relationship_id]
      end

      @manifestables = manifestables.uniq.filter_map do |record_type, record_id, project_model_relationship_id|
        model_class = record_type.safe_constantize
        next unless model_class&.include?(Manifestable)

        { model_class: model_class, id: record_id, project_model_relationship_id: project_model_relationship_id }
      end
    end

    def update_relationship_manifests(relationship, service, is_primary)
      if is_primary
        related_model = relationship.related_record_type.constantize
        related_record_id = relationship.related_record_id
      else
        related_model = relationship.primary_record_type.constantize
        related_record_id = relationship.primary_record_id
      end

      service.reset_manifests_by_type(related_model, {
        id: related_record_id,
        project_model_relationship_id: relationship.project_model_relationship_id,
        limit: ENV['IIIF_MANIFEST_ITEM_LIMIT']
      })
    end
  end
end