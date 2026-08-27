module CoreDataConnector
  module Merge
    class Merger
      MANIFEST_ATTRIBUTES = [
        :project_model_relationship_id
      ]

      MERGE_ATTRIBUTES = [
        :merged_uuid
      ]

      RELATIONSHIP_ATTRIBUTES = [
        :project_model_relationship_id,
        :primary_record_type,
        :related_record_id,
        :related_record_type,
        :user_defined
      ]

      RELATED_RELATIONSHIP_ATTRIBUTES = [
        :project_model_relationship_id,
        :primary_record_id,
        :primary_record_type,
        :related_record_type,
        :user_defined
      ]

      WEB_IDENTIFIER_ATTRIBUTES = [
        :web_authority_id,
        :identifier,
        :extra
      ]

      def merge(new_record, merged_records)
        manifests = []
        record_merges = []
        relationships = []
        related_relationships = []
        web_identifiers = []

        merged_records.each do |record|
          # Append the manifests from the merged record(s) to the new record
          record.manifests.each { |manifest| add_item(manifests, manifest, MANIFEST_ATTRIBUTES) }

          # Append the merges from the merged record(s) to the new record
          record.record_merges.each { |record_merge| add_item(record_merges, record_merge, MERGE_ATTRIBUTES) }

          # Create a record_merge for the merged record(s)
          unless record.uuid == new_record.uuid
            record_merges << RecordMerge.new(
              merged_uuid: record.uuid,
              merged_name: record.display_name
            )
          end

          # Append the relationships from the merged record(s) to the new record
          record.relationships.each { |relationship| add_item(relationships, relationship, RELATIONSHIP_ATTRIBUTES) }
          record.related_relationships.each { |relationship| add_item(related_relationships, relationship, RELATED_RELATIONSHIP_ATTRIBUTES) }

          # Append the web identifiers from the merged record(s) to the new record
          record.web_identifiers.each { |web_identifier| add_item(web_identifiers, web_identifier, WEB_IDENTIFIER_ATTRIBUTES) }
        end

        # Add the manifests to the new record
        manifests.each { |manifest| manifest.manifestable = new_record }
        new_record.manifests.build(manifests.map(&:as_json))

        # Add the merges to the new record
        record_merges.each { |record_merge| record_merge.mergeable = new_record }
        new_record.record_merges.build(record_merges.map(&:as_json))

        # Add the relationships to the new record
        relationships.each { |relationship| relationship.primary_record = new_record }
        new_record.relationships.build(relationships.map(&:as_json))

        related_relationships.each { |relationship| relationship.related_record = new_record }
        new_record.related_relationships.build(related_relationships.map(&:as_json))

        # Add web identifiers to the new record
        web_identifiers.each { |web_identifier| web_identifier.identifiable = new_record }
        new_record.web_identifiers.build(web_identifiers.map(&:as_json))

        # Save the new record
        success = new_record.save

        if success
          # Re-generate manifests
          service = Iiif::Manifest.new
          service.reset_manifests_by_type(new_record.class, { id: new_record.id })

          # Destroy the merged records
          merged_records.destroy_all
        end
      end

      private

      def add_item(array, item, attrs)
        included = false

        array.each do |i|
          included = true and break if attrs.all? { |attr| i[attr] == item[attr] }
        end

        array << item.dup unless included
      end
    end
  end
end