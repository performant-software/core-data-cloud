module CoreDataConnector
  module Authority
    class Dpla < Base
      include Http::Requestable

      BASE_URL = 'https://api.dp.la/v2/items'

      DEFAULT_LIMIT = 20

      def find(id, options = {})
        params = {
          api_key: options[:api_key]
        }

        send_request("#{BASE_URL}/#{id}", method: :get, params: params) do |body|
          JSON.parse(body)
        end
      end

      def search(query, options = {})
        params = {
          api_key: options[:api_key],
          page_size: options[:limit] || DEFAULT_LIMIT,
          q: query
        }

        send_request(BASE_URL, method: :get, params: params) do |body|
          JSON.parse(body)
        end
      end
    end
  end
end