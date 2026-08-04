require_relative 'base'

module Typesense
  class Search < Base
    attr_reader :client, :collection_name

    def index(options)
      collection = client.collections[collection_name]

      project_model_ids = options.delete(:project_model_ids)
      options[:include_relationships] = true

      # Query project_models and build a hash of class names to arrays if project_model IDs
      model_classes = CoreDataConnector::ProjectModel
                        .where(id: project_model_ids)
                        .pluck(:id, :model_class)
                        .inject({}) do |hash, record|
                          id, model_class = record

                          hash[model_class] ||= []
                          hash[model_class] << id

                          hash
                        end

      # Append a unique import_id to all of the documents indexed in this batch
      import_id = DateTime.now.to_i
      import_attributes = { import_id: import_id }

      # Iterate over the keys and query the records belonging to each project model
      model_classes.keys.each do |model_class|
        klass = model_class.constantize
        ids = model_classes[model_class]

        klass.for_search(ids) do |records|
          documents = records.map { |r| r.to_search_json(options).merge(import_attributes) }
          collection.documents.import(documents, action: 'emplace')
        end
      end

      # Delete any records from the index not included in this batch
      collection.documents.delete(filter_by: "import_id:!=#{import_id}")
    end

    def update
      collection_schema = client.collections[collection_name]

      collection = collection_schema.retrieve
      fields = collection['fields']

      fields_to_update = []

      # Update any fields where the name ends with "_facet" and are not flagged as facetable.
      # Update any fields named "coordinates" to type "geopoint"
      fields.each do |field|
        name = field['name']

        if name.end_with?('_facet') && !field['facet']
          fields_to_update.push({ name: name, drop: true }, field.merge({ facet: true }))
        elsif name.include?('.coordinates') && !name.include?('geometry') && field['type'] != 'geopoint[]'
          fields_to_update.push({ name: name, drop: true }, field.merge({ type: 'geopoint[]', sort: true }))
        end
      end

      collection_schema.update({ fields: fields_to_update })
    end

    protected

    def schema
      {
        name: collection_name,
        enable_nested_fields: true,
        fields: [{
          name: 'geometry',
          type: 'object',
          index: false,
          facet: false,
          optional: true
        }, {
          name: 'properties',
          type: 'object',
          index: false,
          facet: false,
          optional: true
        }, {
          name: 'coordinates',
          type: 'geopoint',
          facet: false,
          optional: true
        }, {
          name: 'name',
          type: 'string',
          sort: true,
          optional: true
        }, {
          name: 'thumbnail',
          type: 'string',
          facet: false,
          optional: true,
          index: false
        }, {
          name: '.*_facet',
          type: 'auto',
          facet: true
        }, {
          name: '.*',
          type: 'auto'
       }]
      }
    end
  end
end
