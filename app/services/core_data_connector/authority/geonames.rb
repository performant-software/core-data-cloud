module CoreDataConnector
  module Authority
    class Geonames < Base
      include Http::Requestable

      BASE_URL = 'http://api.geonames.org'

      def find(id, options = {})
        params = {
          geonameId: id,
          username: options[:username]
        }
        send_request("#{BASE_URL}/getJSON", method: :get, params:) do |body|
          JSON.parse(body)
        end
      end

      def search(query, options = {})
        params = {
          q: query,
          username: options[:username]
        }
        send_request("#{BASE_URL}/searchJSON?", method: :get, params:) do |body|
          JSON.parse(body)
        end
      end
    end
  end
end
