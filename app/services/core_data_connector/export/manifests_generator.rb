module CoreDataConnector
  module Export
    # Generates, for a single top-level model record (see JsonExporter::TOP_LEVEL_MODELS), one IIIF
    # Presentation Manifest per relationship type (ProjectModelRelationship) connecting it to
    # published MediaContent, plus a Collection aggregating them - written within the same
    # per-record directory JsonExporter already writes <uuid>.json / <uuid>/<related_model>.json
    # into:
    #
    #   <route_key>/<uuid>/manifests.json                      # Collection
    #   <route_key>/<uuid>/<relationship_uuid>/manifest.json   # one Manifest per relationship type
    #
    # This supersedes the retired Iiif::StaticManifest/GenerateStaticManifestsJob, which wrote the
    # equivalent documents directly to iiif-cloud's R2 bucket via a separate admin action run
    # *after* static image assets already existed. Folding this into the export means it now runs
    # *before* those assets necessarily exist (export happens first in the static build pipeline),
    # so - unlike the retired code - this fetches each resource's width/height from its *dynamic*
    # (not-yet-static) info endpoint, which is reachable as soon as a resource is uploaded,
    # independent of static asset generation. Canvases still reference the eventual static image
    # asset URLs (iiif/3/image/<resource_uuid>/...), unchanged, written independently by
    # iiif-cloud's create_static_assets job - this class only ever references those paths, it
    # never generates or requires them to already exist.
    class ManifestsGenerator
      IMAGE_FORMAT = 'jpg'

      def initialize(base_url:)
        @base_url = base_url.chomp('/')
        @info_cache = {}
      end

      # Preloads the relationship associations #generate needs onto the given batch of records,
      # scoped to published media content. Call once per model class's full batch of records
      # before calling #generate for each - mirrors the two preload passes the retired
      # Iiif::StaticManifest#apply_preloads performed, just run earlier (batched, before the
      # per-record loop) rather than owning its own top-level query.
      def self.preload(records)
        primary_scope = CoreDataConnector::Relationship
                          .joins(:related_media_content)
                          .where(CoreDataConnector::MediaContent.arel_table[:published].eq(true))
                          .order(
                            CoreDataConnector::Relationship.arel_table[:order],
                            CoreDataConnector::MediaContent.arel_table[:name],
                            CoreDataConnector::MediaContent.arel_table[:id]
                          )

        Preloader.new(
          records: records,
          associations: [relationships: [:project_model_relationship, :related_record]],
          scope: primary_scope
        ).call

        inverse_scope = CoreDataConnector::Relationship
                          .joins(:project_model_relationship)
                          .joins(:inverse_related_media_content)
                          .where(project_model_relationship: { allow_inverse: true })
                          .where(CoreDataConnector::MediaContent.arel_table[:published].eq(true))
                          .order(
                            CoreDataConnector::Relationship.arel_table[:order],
                            CoreDataConnector::MediaContent.arel_table[:name],
                            CoreDataConnector::MediaContent.arel_table[:id]
                          )

        Preloader.new(
          records: records,
          associations: [related_relationships: [:project_model_relationship, :primary_record]],
          scope: inverse_scope
        ).call
      end

      # Writes the manifest(s)/collection for +record+ (whose relationships/related_relationships
      # must already be preloaded via .preload above) into +model_directory+, the same directory
      # JsonExporter writes <uuid>.json into for this model. Writes nothing if the record has no
      # media relationships.
      def generate(record, route_key, model_directory)
        groups = group_by_relationship(record)

        collection_items = groups.filter_map do |info|
          next if info[:resources].empty?

          write_manifest(record, route_key, info, model_directory)
        end

        write_collection(record, route_key, collection_items, model_directory) if collection_items.any?
      end

      private

      attr_reader :base_url

      def group_by_relationship(record)
        hash = {}

        record.relationships.each do |relationship|
          add_resource(hash, relationship.project_model_relationship, relationship.related_record)
        end

        record.related_relationships.each do |relationship|
          add_resource(hash, relationship.project_model_relationship, relationship.primary_record)
        end

        hash.values
      end

      def add_resource(hash, project_model_relationship, resource)
        key = project_model_relationship.uuid

        hash[key] ||= {
          uuid: key,
          name: project_model_relationship.name,
          resources: []
        }

        hash[key][:resources] << resource.resource_description&.resource_id
        hash[key][:resources].compact!
      end

      def write_manifest(record, route_key, info, model_directory)
        manifest = build_manifest(record, route_key, info)
        write_json(File.join(model_directory, record.uuid, info[:uuid], 'manifest.json'), manifest)

        to_collection_item(manifest, info)
      end

      def write_collection(record, route_key, collection_items, model_directory)
        collection = build_collection(record, route_key, collection_items)
        write_json(File.join(model_directory, record.uuid, 'manifests.json'), collection)
      end

      def build_manifest(record, route_key, info)
        canvases = info[:resources].each_with_index.map { |resource_id, index| build_canvas(resource_id, index + 1) }
        label = find_label(record)

        {
          '@context' => [
            'http://www.w3.org/ns/anno.jsonld',
            'http://iiif.io/api/presentation/3/context.json'
          ],
          'id' => "#{base_url}/#{route_key}/#{record.uuid}/#{info[:uuid]}/manifest.json",
          'type' => 'Manifest',
          'label' => { 'en' => [I18n.t('services.iiif.manifest.label', name: label, relationship: info[:name])] },
          'items' => canvases
        }
      end

      def build_collection(record, route_key, items)
        {
          '@context' => 'http://iiif.io/api/presentation/3/context.json',
          'id' => "#{base_url}/#{route_key}/#{record.uuid}/manifests.json",
          'type' => 'Collection',
          'label' => { 'en' => [find_label(record)].compact },
          'items' => items
        }
      end

      def build_canvas(resource_id, index)
        service_url = "#{base_url}/iiif/3/image/#{resource_id}"
        info = fetch_dynamic_info(resource_id)

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
        # IIIF v3 requires thumbnail to be an array of resources, even for a single thumbnail.
        body = manifest.dig('items', 0, 'items', 0, 'items', 0, 'body')

        {
          'id' => manifest['id'],
          'type' => 'Manifest',
          'label' => manifest['label'],
          'item_count' => info[:resources].size,
          'thumbnail' => [body.slice('id', 'type', 'format', 'width', 'height')]
        }
      end

      # Fetches width/height from the resource's *dynamic* (Cantaloupe-backed) info endpoint,
      # rather than the static one the retired Iiif::StaticManifest used - this one is reachable
      # immediately after upload, before static assets necessarily exist. Memoized per export run,
      # since the same resource can be related to many different records.
      def fetch_dynamic_info(resource_id)
        return @info_cache[resource_id] if @info_cache.key?(resource_id)

        response = HTTParty.get("#{TripleEyeEffable.config.url}/public/resources/#{resource_id}/info")
        @info_cache[resource_id] = response.success? ? JSON.parse(response.body) : {}
      rescue StandardError
        @info_cache[resource_id] = {}
      end

      def find_label(record)
        return record.full_name if record.is_a?(CoreDataConnector::Person)
        return record.name if record.respond_to?(:name)

        nil
      end

      def write_json(filepath, payload)
        FileUtils.mkdir_p(File.dirname(filepath))
        File.write(filepath, JSON.generate(payload))
      end

    end
  end
end
