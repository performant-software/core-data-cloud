module CoreDataConnector
  module Authority
    class Viaf < Base
      include Http::Requestable

      BASE_URL = 'https://viaf.org'
      DEFAULT_LIMIT = 20

      def find(id, options = {})
        headers = {
          'Accept': 'application/json'
        }

        send_request("#{BASE_URL}/viaf/#{id}", method: :get, headers:) do |body|
          JSON.parse(body)
        end
      end

      def search(query, options = {})
        headers = {
          'Accept': 'application/json'
        }

        params = {
          query: query
        }

        send_request("#{BASE_URL}/viaf/AutoSuggest", method: :get, headers:, params:) do |body|
          JSON.parse(body)
        end
      end
    end
  end
end