require 'typesense'

module Typesense
  class Base
    attr_reader :client, :collection_name

    def initialize(host:, port:, protocol:, api_key:, collection_name:)
      @client = CoreDataConnector::Typesense.create_client(host:, port:, protocol:, api_key:)
      @collection_name = collection_name
    end

    def create
      client.collections.create(schema)
    end

    def index(options)
      # Implemented in sub-class
    end

    def delete
      client.collections[collection_name].delete
    end

    def update
      # Implemented in sub-class
    end

    protected

    def schema
      # Implemented in sub-class
    end
  end
end
