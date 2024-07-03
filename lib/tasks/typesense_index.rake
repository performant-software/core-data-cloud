require 'typesense'

namespace :core_data_cloud do
  desc 'Create search only key.'
  task create_index: :environment do
    client = Typesense::Client.new(
      nodes: [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http'
        }
      ],
      api_key: ENV['TYPESENSE_API_KEY']
    )

    collection_name = 'gca'

    collection = client.collections[collection_name]
    model_ids = [1, 2, 3, 4, 6]

    schema = {
      name: collection_name,
      enable_nested_fields: true,
      fields: [{
        name: 'coordinates',
        type: 'geopoint',
        facet: false,
        optional: true
      }, {
        name: '.*_facet',
        type: 'auto',
        facet: true
      }, {
        name: '.*',
        type: 'auto'
      }]
    }

    client.collections.create(schema)

    # Query project_models and build a hash of class names to arrays if project_model IDs
    model_classes = CoreDataConnector::ProjectModel
                    .where(id: model_ids)
                    .pluck(:id, :model_class)
                    .each_with_object({}) do |record, hash|
      id, model_class = record

      hash[model_class] ||= []
      hash[model_class] << id
    end

    # Append a unique import_id to all of the documents indexed in this batch
    import_id = DateTime.now.to_i
    import_attributes = { import_id: }

    # Iterate over the keys and query the records belonging to each project model
    model_classes.each_key do |model_class|
      klass = model_class.constantize
      ids = model_classes[model_class]

      klass.for_search(ids) do |records|
        documents = records.map { |r| r.to_search_json(false).merge(import_attributes) }
        collection.documents.import(documents, action: 'emplace')
      end
    end

    begin
      client.keys.create(
        description: 'Search-only GCA',
        actions: ['documents:search'],
        collections: [collection_name],
        value: ENV['TYPESENSE_SEARCH_KEY'],
        expires_at: (Time.now + 10.years).to_i
      )
    end
  rescue Typesense::Error::ObjectAlreadyExists
    puts "Key already exists"
  end
end
