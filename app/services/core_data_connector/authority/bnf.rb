module CoreDataConnector
  module Authority
    class Bnf < Base
      include Http::Requestable

      BASE_URL = 'https://catalogue.bnf.fr/api/SRU'

      DEFAULT_LIMIT = 20

      BASE_PARAMS = {
        operation: 'searchRetrieve',
        startRecord: 1,
        recordSchema: 'dublincore',
        version: 1.2
      }

      def find(id, options = {})
        params = {
          query: "bib.ark+all+\"#{id}\"",
          maximumRecords: options[:limit] || DEFAULT_LIMIT
        }.merge(BASE_PARAMS)

        send_request(BASE_URL, params: params) do |body|
          Hash.from_xml(body).to_json
        end
      end

      def search(query, options = {})
        params = {
          query: "bib.anywhere+all+\"#{query}\"",
          maximumRecords: options[:limit] || DEFAULT_LIMIT
        }.merge(BASE_PARAMS)

        send_request(BASE_URL, params: params) do |body|
          Hash.from_xml(body).to_json
        end
      end
    end
  end
end