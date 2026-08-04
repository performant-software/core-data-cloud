module CoreDataConnector
  module Authority
    class Atom < Base
      include Http::Requestable

      def before_create(web_identifier)
        authority = web_identifier.web_authority
        options = authority.access&.symbolize_keys

        data = find(web_identifier.identifier, options)

        web_identifier.extra ||= {}
        web_identifier.extra['title'] = data['title']

        parents = []

        find_parents(data['parent'], options, parents)

        web_identifier.extra['parents'] = parents.reverse
      end

      def find(id, options = {})
        headers = {
          'REST-API-Key': options[:api_key]
        }

        send_request("#{options[:url]}/api/informationobjects/#{id}", headers: headers) do |body|
          JSON.parse(body)
        end
      end

      def search(query, options = {})
        params = {
          sq0: query
        }

        headers = {
          'REST-API-Key': options[:api_key]
        }

        send_request("#{options[:url]}/api/informationobjects", headers: headers, params: params) do |body|
          JSON.parse(body)
        end
      end

      private

      def find_parents(identifier, options, arr)
        data = find(identifier, options)

        arr << data['title']

        find_parents(data['parent'], options, arr) if data['parent'].present?
      end
    end
  end
end