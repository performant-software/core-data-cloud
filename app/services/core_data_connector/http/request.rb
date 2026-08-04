require 'typhoeus'

module CoreDataConnector
  module Http
    class Request

      DEFAULT_GET_OPTIONS = {
        followlocation: true
      }

      def self.delete(url, options = {})
        parse_response Typhoeus.delete(url, options)
      end

      def self.get(url, options = {})
        parse_response Typhoeus.get(url, options.merge(DEFAULT_GET_OPTIONS))
      end

      def self.post(url, options = {})
        parse_response Typhoeus.post(url, options)
      end

      def self.put(url, options = {})
        parse_response Typhoeus.put(url, options)
      end

      private

      def self.parse_response(response)
        {
          code: response.code,
          data: response.body,
          success: response.success?
        }
      end

    end
  end
end