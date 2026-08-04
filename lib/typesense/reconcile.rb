require_relative 'base'

module Typesense
  class Reconcile < Base
    attr_reader :client, :collection_name, :project

    def create
      client.collections.create(schema)
    end

    def delete
      client.collections[collection_name].delete
    end

    def index(options)
      collection = client.collections[collection_name]
      project_id = options[:project_id]

      index_model_class CoreDataConnector::Event, project_id, collection
      index_model_class CoreDataConnector::Instance, project_id, collection
      index_model_class CoreDataConnector::Item, project_id, collection
      index_model_class CoreDataConnector::Organization, project_id, collection
      index_model_class CoreDataConnector::Person, project_id, collection
      index_model_class CoreDataConnector::Place, project_id, collection
      index_model_class CoreDataConnector::Taxonomy, project_id, collection
      index_model_class CoreDataConnector::Work, project_id, collection
    end

    protected

    def schema
      {
        name: collection_name,
        enable_nested_fields: false,
        fields: [{
          name: '.*',
          type: 'auto'
        }]
      }
    end

    private

    def index_model_class(klass, project_id, collection)
      klass.for_reconcile(project_id) do |records|
        documents = records.map(&:to_reconcile_json)
        collection.documents.import(documents, action: 'emplace')
      end
    end
  end
end