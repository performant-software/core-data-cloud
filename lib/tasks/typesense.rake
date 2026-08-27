require_relative '../typesense/options'
require_relative '../typesense/reconcile'
require_relative '../typesense/search'

namespace :typesense do

  namespace :reconcile do

    desc 'Creates a new Typesense collection'
    task create: :environment do
      options = Typesense::Options.parse(ARGV) do |opts|
        opts.banner = 'Usage: typesense:create -- --host --port --protocol --api-key --collection-name'
      end

      reconcile = Typesense::Reconcile.new(
        host: options[:host],
        port: options[:port],
        protocol: options[:protocol],
        api_key: options[:api_key],
        collection_name: options[:collection_name]
      )

      reconcile.create
    end

    desc 'Deletes the Typesense collection'
    task delete: :environment do
      options = Typesense::Options.parse(ARGV) do |opts|
        opts.banner = 'Usage: typesense:delete -- --host --port --protocol --api-key --collection-name'
      end

      reconcile = Typesense::Reconcile.new(
        host: options[:host],
        port: options[:port],
        protocol: options[:protocol],
        api_key: options[:api_key],
        collection_name: options[:collection_name]
      )

      begin
        reconcile.delete
      rescue
        # Do nothing, collection doesn't exist yet
      end
    end

    desc 'Index documents into Typesense'
    task index: :environment do
      options = Typesense::Options.parse(ARGV) do |opts, options|
        opts.banner = 'Usage: typesense:index -- --host --port --protocol --api-key --collection-name --project-id'
        opts.on('-j', '--project-id ARG', Integer) { |id| options[:project_id] = id&.to_i }
      end

      reconcile = Typesense::Reconcile.new(
        host: options[:host],
        port: options[:port],
        protocol: options[:protocol],
        api_key: options[:api_key],
        collection_name: options[:collection_name]
      )

      reconcile.index options.slice(:project_id)
    end
  end

  namespace :search do

    desc 'Creates a new Typesense collection'
    task create: :environment do
      options = Typesense::Options.parse(ARGV) do |opts|
        opts.banner = 'Usage: typesense:create -- --host --port --protocol --api-key --collection-name'
      end

      search = Typesense::Search.new(
        host: options[:host],
        port: options[:port],
        protocol: options[:protocol],
        api_key: options[:api_key],
        collection_name: options[:collection_name]
      )

      search.create
    end

    desc 'Deletes the Typesense collection'
    task delete: :environment do
      options = Typesense::Options.parse(ARGV) do |opts|
        opts.banner = 'Usage: typesense:delete -- --host --port --protocol --api-key --collection-name'
      end

      search = Typesense::Search.new(
        host: options[:host],
        port: options[:port],
        protocol: options[:protocol],
        api_key: options[:api_key],
        collection_name: options[:collection_name]
      )

      begin
        search.delete
      rescue
        # Do nothing, collection doesn't exist yet
      end
    end

    desc 'Index documents into Typesense'
    task index: :environment do
      options = Typesense::Options.parse(ARGV) do |opts, options|
        opts.banner = 'Usage: typesense:index -- --host --port --protocol --api-key --collection-name --project-models --polygons'
        opts.on('-m', '--project-models ARG', Array) { |ids| options[:project_model_ids] = ids.map(&:to_i) }
        opts.on('-g', '--polygons ARG', String) { |polygons| options[:polygons] = polygons.to_bool }
      end

      search = Typesense::Search.new(
        host: options[:host],
        port: options[:port],
        protocol: options[:protocol],
        api_key: options[:api_key],
        collection_name: options[:collection_name]
      )

      search.index options.slice(:project_model_ids, :polygons)
    end

    desc 'Updates the Typesense collection'
    task update: :environment do
      options = Typesense::Options.parse(ARGV) do |opts|
        opts.banner = 'Usage: typesense:create -- --host --port --protocol --api-key --collection-name'
      end

      search = Typesense::Search.new(
        host: options[:host],
        port: options[:port],
        protocol: options[:protocol],
        api_key: options[:api_key],
        collection_name: options[:collection_name]
      )

      search.update
    end
  end
end