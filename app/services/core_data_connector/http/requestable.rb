require 'typhoeus'

module CoreDataConnector
  module Http
    module Requestable
      extend ActiveSupport::Concern

      CODE_NO_RESPONSE = 0

      included do
        def send_request(url, options)
          request = Typhoeus::Request.new(url, options)

          response = request.run

          if response.success?
            yield response.body
          elsif response.timed_out?
            render_errors I18n.t('errors.http.timeout')
          elsif response.code == CODE_NO_RESPONSE
            render_errors I18n.t('errors.http.no_response')
          else
            render_errors I18n.t('errors.http.general')
          end
        end

        private

        def render_errors(message)
          { errors: [message] }
        end
      end
    end
  end
end