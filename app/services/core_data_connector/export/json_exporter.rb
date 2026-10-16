require 'json'

module CoreDataConnector
  module Export
    # Exports a project's published data as a tree of JSON files that exactly mirror the public v1
    # API's responses (see config/routes/v1.rb), e.g.:
    #
    #   descriptors.json
    #   resources.json                      # flat list of iiif-cloud resource UUIDs for media content
    #   events/index.json
    #   events/<uuid>.json
    #   events/<uuid>/instances.json
    #   events/<uuid>/items.json
    #   events/<uuid>/manifests.json              # Collection of this record's media manifests, if any
    #   events/<uuid>/<relationship_uuid>/manifest.json   # one Manifest per relationship type, if any
    #   ...
    #   media_contents/index.json           # no :show / nested routes exist for media_contents
    #
    # +taxonomies+ has no top-level public v1 route (only nested), so it is only ever written as a
    # nested file (e.g. events/<uuid>/taxonomies.json), never as its own top-level directory.
    #
    # Reuses the same AR scopes (CoreDataConnector::Ownable/Publishable), the same
    # Public::V1::RelatedRecordsQuery used by the live nested API routes, and the actual public v1
    # serializer classes (CoreDataConnector::Public::V1::*Serializer#render_index/#render_show) so
    # the generated JSON matches the live API byte-for-byte in shape.
    class JsonExporter

      # Resources exposed at GET /public/v1/:model and GET /public/v1/:model/:uuid
      TOP_LEVEL_MODELS = [
        CoreDataConnector::Event,
        CoreDataConnector::Instance,
        CoreDataConnector::Item,
        CoreDataConnector::Organization,
        CoreDataConnector::Person,
        CoreDataConnector::Place,
        CoreDataConnector::Work
      ].freeze

      # Resources only exposed at GET /public/v1/:model (no :show route)
      INDEX_ONLY_MODELS = [
        CoreDataConnector::MediaContent
      ].freeze

      # Every resource nested under GET /public/v1/:model/:uuid/:related_model
      NESTED_MODELS = (TOP_LEVEL_MODELS + INDEX_ONLY_MODELS + [CoreDataConnector::Taxonomy]).freeze

      attr_reader :project_id, :base_url

      # base_url is the site's eventual public base URL (e.g. "https://my-site.example.com") -
      # used only for the "id" fields of generated manifests/collections and the image service
      # URLs their canvases reference (see Export::ManifestsGenerator), consistent with how
      # iiif-cloud's create_static_assets already uses a single base_url for both purposes.
      def initialize(project_id, base_url:)
        @project_id = project_id
        @base_url = base_url
      end

      def run(directory)
        write_json(File.join(directory, 'descriptors.json'), { descriptors: descriptors_query.call })
        write_json(File.join(directory, 'resources.json'), { resource_ids: resource_ids })

        (TOP_LEVEL_MODELS + INDEX_ONLY_MODELS).each do |model_class|
          export_model(model_class, directory)
        end
      end

      private

      def descriptors_query
        Public::V1::DescriptorsQuery.new(project_id)
      end

      # Memoized so its per-run info.json cache (see Export::ManifestsGenerator#fetch_dynamic_info)
      # is shared across every record in the project, not just within one model's batch.
      def manifests_generator
        @manifests_generator ||= Export::ManifestsGenerator.new(base_url: base_url)
      end

      # The iiif-cloud resource UUIDs (note: despite the column name, resource_id stores the
      # iiif-cloud resource's UUID - see TripleEyeEffable::Cloud#parse_response) for every
      # published media content in the project. This is the list a caller (e.g. the
      # core-data-places static build script) sends to iiif-cloud's create_static_assets endpoint
      # to generate level 0 image assets for exactly the media referenced by this export.
      def resource_ids
        base_query(CoreDataConnector::MediaContent)
          .joins(:resource_description)
          .pluck('triple_eye_effable_resource_descriptions.resource_id')
      end

      def export_model(model_class, directory)
        records = base_query(model_class).to_a
        return if records.empty?

        apply_preloads(model_class, records, :index)

        # Must run before index_payload (just below): TypeableSerializer (included by every
        # top-level model's serializer) reads item.relationships/related_relationships while
        # rendering *both* the index and show payloads. If that touches the association first, it
        # lazily loads it unscoped (every relationship, not just ones to media content) and caches
        # that on the record - and Rails' preloader silently skips an association that's already
        # loaded, so this properly-scoped preload would then have no effect if run any later.
        Export::ManifestsGenerator.preload(records) if TOP_LEVEL_MODELS.include?(model_class)

        model_directory = File.join(directory, route_key(model_class))
        FileUtils.mkdir_p(model_directory)

        write_json(File.join(model_directory, 'index.json'), index_payload(model_class, records))

        return unless TOP_LEVEL_MODELS.include?(model_class)

        apply_preloads(model_class, records, :show)
        records.each { |record| export_record(model_class, record, model_directory) }
      end

      def export_record(model_class, record, model_directory)
        payload = { singular_key(model_class) => serializer_for(model_class).render_show(record) }
        write_json(File.join(model_directory, "#{record.uuid}.json"), payload)

        NESTED_MODELS.each { |related_class| export_nested(record, related_class, model_directory) }

        manifests_generator.generate(record, route_key(model_class), model_directory)
      end

      def export_nested(record, related_class, model_directory)
        query = Public::V1::RelatedRecordsQuery.new(
          record: record,
          related_class: related_class,
          project_ids: [project_id]
        )

        records = query.call.to_a

        # Skip writing a file entirely when there are no related records for this connection
        return if records.empty?

        query.preload(records)
        apply_preloads(related_class, records, :index)

        nested_directory = File.join(model_directory, record.uuid)
        FileUtils.mkdir_p(nested_directory)

        write_json(File.join(nested_directory, "#{route_key(related_class)}.json"), index_payload(related_class, records))
      end

      def base_query(model_class)
        model_class
          .all_records_by_project(project_id)
          .joins(project_model: :project)
          .where.not(project: { archived: true })
          .published
      end

      def index_payload(model_class, records)
        {
          route_key(model_class).to_sym => serializer_for(model_class).render_index(records),
          list: { count: records.size }
        }
      end

      def serializer_for(model_class)
        "CoreDataConnector::Public::V1::#{route_key(model_class).camelize}Serializer".constantize.new(nil, {})
      end

      def route_key(model_class)
        model_class.name.demodulize.underscore.pluralize
      end

      def singular_key(model_class)
        model_class.name.demodulize.underscore.to_sym
      end

      # Mirrors the preload associations declared on the corresponding public v1 controller (e.g.
      # `preloads :source_names` / `preloads web_identifiers: :web_authority, only: :show`), so the
      # export avoids the same N+1 queries the live API avoids, without duplicating the association
      # lists here. See Api::Queryable (resource_api gem) for the macro these controllers use.
      def apply_preloads(model_class, records, action)
        specs = preload_specs(model_class, action)
        return if specs.empty?

        Preloader.new(records: records, associations: specs).call
      end

      def preload_specs(model_class, action)
        controller_class = "CoreDataConnector::Public::V1::#{route_key(model_class).camelize}Controller".constantize

        Array(controller_class.preloads).flat_map do |group|
          next [] if skip_preload_group?(group, action)

          group.map { |spec| spec.is_a?(Hash) ? spec.except(:only, :except, :scope, :if, :limit) : spec }
        end
      end

      # Mirrors Api::Queryable#skip_relationships? : a preload group declared with `only:`/`except:`
      # only applies for the matching controller action(s) (:index or :show).
      def skip_preload_group?(group, action)
        only = group.flat_map { |spec| spec.is_a?(Hash) ? Array(spec[:only]) : [] }
        except = group.flat_map { |spec| spec.is_a?(Hash) ? Array(spec[:except]) : [] }

        return false if only.empty? && except.empty?

        only.exclude?(action) || except.include?(action)
      end

      def write_json(filepath, payload)
        File.write(filepath, JSON.generate(payload))
      end

    end
  end
end
