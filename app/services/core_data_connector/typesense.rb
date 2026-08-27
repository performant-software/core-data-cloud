require 'typesense'

module CoreDataConnector
  class Typesense

    def self.create_client(host:, port:, protocol:, api_key:)
      ::Typesense::Client.new(
        nodes: [{ host:, port:, protocol: }],
        api_key:,
        num_retries: 10,
        healthcheck_interval_seconds: 1,
        retry_interval_seconds: 0.01,
        connection_timeout_seconds: 30,
        logger: Logger.new($stdout),
        log_level: Logger::INFO
      )
    end

  end
end