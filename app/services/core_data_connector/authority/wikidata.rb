module CoreDataConnector
  module Authority
    class Wikidata < Base
      include Http::Requestable

      BASE_URL = 'https://www.wikidata.org/w/api.php'

      DEFAULT_LIMIT = 20

      def find(id, options = {})
        params = {
          action: 'wbgetentities',
          format: 'json',
          ids: id,
          languages: 'en',
          type: 'item',
        }

        send_request(BASE_URL, method: :get, params: params) do |body|
          JSON.parse(body)
        end
      end

      def search(query, options = {})
        params = {
          action: 'wbsearchentities',
          format: 'json',
          language: 'en',
          limit: options[:limit] || DEFAULT_LIMIT,
          search: query,
          type: 'item',
          uselang: 'en'
        }

        send_request(BASE_URL, method: :get, params: params) do |body|
          JSON.parse(body)
        end
      end
    end
  end
end