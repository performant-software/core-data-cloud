
require 'typesense'

namespace :core_data_cloud do
  desc "Create search only key."
  task :create_search_key do
    client = Typesense::Client.new(
      nodes: [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http'
        }
      ],
      api_key: ENV['TYPESENSE_API_KEY'],
    )

    client.keys.create(
      description: 'Search-only GCA',
      actions: ['documents:search'],
      collections: ['gca'],
      value: ENV['TYPESENSE_SEARCH_KEY'],
      expires_at: (Time.now + 10.years).to_i
    )
  end
end