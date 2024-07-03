require 'typesense'

namespace :core_data_cloud do
  desc 'Create search only key.'
  task create_search_key: :environment do
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
