module CoreDataConnector
  module Authority
    class Jisc < Base
      include Http::Requestable

      BASE_URL = 'https://discover.libraryhub.jisc.ac.uk/search'
  
      DEFAULT_LIMIT = 20

      def find(id, options = {})
        params = {
          format: 'json',
          id: id
        }

        send_request(BASE_URL, method: :get, params: params) do |body|
          JSON.parse(body)
        end
      end

      def search(query, options = {})
        params = {
          format: 'json',
          keyword: query
        }

        send_request(BASE_URL, method: :get, params: params) do |body|
          JSON.parse(body)
        end
      end
    end
  end
end