module CoreDataConnector
  module Iiif
    # Generates static, IIIF level 0 compliant Presentation manifests (and a per-record
    # collection aggregating them) for the media related to project model records, mirroring
    # Iiif::Manifest's relationship traversal but writing static JSON files - via IIIF Cloud's
    # static_manifests endpoint - that reference already-generated static level 0 image assets,
    # instead of building a manifest dynamically against live Cantaloupe URLs.
    #
    # Kept independent from Iiif::Manifest (rather than sharing its traversal helpers) since that
    # class backs the existing, already-working dynamic manifest flow and this codebase has no
    # automated test suite to safely verify a shared refactor against.
    class StaticManifest
      IMAGE_FORMAT = 'jpg'

      def initialize(image_base_url:, manifest_base_url:, destination:)
        @image_base_url = image_base_url.chomp('/')
        @manifest_base_url = manifest_base_url.chomp('/')
        @destination = destination
      end

      def generate(model_class, options = {})
        query = build_query(model_class, options)

        query.in_batches do |batch|
          apply_preloads batch, options

          batch.each { |record| generate_for_record(model_class, record, options) }
        end
      end

      private

      attr_reader :image_base_url, :manifest_base_url, :destination

      def generate_for_record(model_class, record, options)
        hash = {}
        label = find_label(record)

        record.relationships.each do |relationship|
          add_resource hash, relationship.project_model_relationship, relationship.related_record
        end

        record.related_relationships.each do |relationship|
          add_resource hash, relationship.project_model_relationship, relationship.primary_record
        end

        collection_items = hash.filter_map do |_project_model_relationship_uuid, info|
          resources = info[:resources]
          resources = resources.take(options[:limit].to_i) if options[:limit].present?
          next if resources.empty?

          write_manifest(model_class, record, label, info, resources)
        end

        write_collection(model_class, record, label, collection_items) if collection_items.any?
      end

      def write_manifest(model_class, record, label, info, resources)
        path = manifest_path(model_class, record, info[:uuid])
        manifest = build_manifest(label, info, resources, path)

        create_static_manifest(path, manifest)

        to_collection_item(manifest, info)
      end

      def write_collection(model_class, record, label, collection_items)
        path = collection_path(model_class, record)
        collection = build_collection(label, collection_items, path)

        create_static_manifest(path, collection)
      end

      def create_static_manifest(path, manifest)
        service = TripleEyeEffable::Cloud.new
        service.create_static_manifest(destination: destination, path: path, manifest: manifest)
      end

      def build_manifest(label, info, resources, path)
        canvases = resources.each_with_index.map { |resource_id, index| build_canvas(resource_id, index + 1) }

        {
          '@context' => [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json'
          ],
          'id' => "#{manifest_base_url}/#{path}",
          'type' => 'Manifest',
          'label' => { 'en' => [I18n.t('services.iiif.manifest.label', name: label, relationship: info[:name])] },
          'items' => canvases
        }
      end

      def build_collection(label, items, path)
        {
          '@context' => 'http://iiif.io/api/presentation/3/context.json',
          'id' => "#{manifest_base_url}/#{path}",
          'type' => 'Collection',
          'label' => { 'en' => [label].compact },
          'items' => items
        }
      end

      def build_canvas(resource_id, index)
        service_url = "#{image_base_url}/iiif/image/v3/#{resource_id}"
        info = fetch_static_info(resource_id)

        canvas_url = "#{service_url}/canvas/#{index}"
        image_url = "#{service_url}/full/max/0/default.#{IMAGE_FORMAT}"

        {
          'id' => canvas_url,
          'type' => 'Canvas',
          'width' => info['width'],
          'height' => info['height'],
          'items' => [{
            'id' => "#{canvas_url}/page/1",
            'type' => 'AnnotationPage',
            'items' => [{
              'id' => "#{canvas_url}/page/1/annotation/1",
              'type' => 'Annotation',
              'motivation' => 'painting',
              'body' => {
                'id' => image_url,
                'type' => 'Image',
                'format' => 'image/jpeg',
                'width' => info['width'],
                'height' => info['height'],
                'service' => [{
                  'id' => service_url,
                  'type' => 'ImageService3',
                  'profile' => 'level0'
                }]
              },
              'target' => canvas_url
            }]
          }]
        }
      end

      def to_collection_item(manifest, info)
        {
          'id' => manifest['id'],
          'type' => 'Manifest',
          'label' => manifest['label'],
          'item_count' => info[:resources].size,
          'thumbnail' => manifest.dig('items', 0, 'items', 0, 'items', 0, 'body', 'id')
        }
      end

      def fetch_static_info(resource_id)
        response = HTTParty.get("#{image_base_url}/iiif/image/v3/#{resource_id}/info.json")
        JSON.parse(response.body)
      rescue StandardError
        {}
      end

      def manifest_path(model_class, record, project_model_relationship_uuid)
        "#{model_class.model_name.route_key}/#{record.uuid}/#{project_model_relationship_uuid}/iiif/presentation/v3/manifest.json"
      end

      def collection_path(model_class, record)
        "#{model_class.model_name.route_key}/#{record.uuid}/iiif/presentation/v3/collection.json"
      end

      def find_label(record)
        return record.full_name if record.is_a?(Person)

        return record.name if record.respond_to?(:name)

        nil
      end

      def add_resource(hash, project_model_relationship, resource)
        key = project_model_relationship.uuid

        hash[key] ||= {
          uuid: key,
          id: project_model_relationship.id,
          name: project_model_relationship.name,
          resources: []
        }

        hash[key][:resources] << resource.resource_description&.resource_id
        hash[key][:resources].compact!
      end

      def apply_preloads(query, options)
        relationships_scope = Relationship
                                .joins(:related_media_content)
                                .where(MediaContent.arel_table[:published].eq(true))
                                .order(
                                  Relationship.arel_table[:order],
                                  MediaContent.arel_table[:name],
                                  MediaContent.arel_table[:id]
                                )

        if options[:project_model_relationship_id].present?
          relationships_scope = relationships_scope.where(
            project_model_relationship_id: options[:project_model_relationship_id]
          )
        end

        Preloader.new(
          records: query,
          associations: [
            relationships: [:project_model_relationship, :related_record]
          ],
          scope: relationships_scope
        ).call

        related_relationships_scope = Relationship
                                        .joins(:project_model_relationship)
                                        .joins(:inverse_related_media_content)
                                        .where(project_model_relationship: { allow_inverse: true })
                                        .where(MediaContent.arel_table[:published].eq(true))
                                        .order(
                                          Relationship.arel_table[:order],
                                          MediaContent.arel_table[:name],
                                          MediaContent.arel_table[:id]
                                        )

        if options[:project_model_relationship_id].present?
          related_relationships_scope = related_relationships_scope.where(
            project_model_relationship_id: options[:project_model_relationship_id]
          )
        end

        Preloader.new(
          records: query,
          associations: [
            related_relationships: [:project_model_relationship, :primary_record]
          ],
          scope: related_relationships_scope
        ).call
      end

      def build_query(model_class, options)
        primary_model_table = Arel::Table.new('primary_model')
        related_model_table = Arel::Table.new('related_model')

        primary_query = ProjectModel
                          .joins(project_model_relationships: [:primary_model, :related_model])
                          .where(primary_model_table[:id].eq(model_class.arel_table[:project_model_id]))
                          .where(related_model: { model_class: MediaContent.to_s })

        related_query = ProjectModel
                          .joins(project_model_relationships: [:primary_model, :related_model])
                          .where(related_model_table[:id].eq(model_class.arel_table[:project_model_id]))
                          .where(project_model_relationships: { allow_inverse: true })
                          .where(primary_model: { model_class: MediaContent.to_s })

        query = model_class
                  .joins(:project_model)
                  .where(primary_query.or(related_query).arel.exists)

        query = query.where(project_model: { project_id: options[:project_id] }) if options[:project_id].present?
        query = query.where(id: options[:id]) if options[:id].present?

        query
      end
    end
  end
end
