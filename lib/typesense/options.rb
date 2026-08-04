module Typesense
  class Options
    def self.parse(args, &block)
      options = {}

      opts = OptionParser.new

      block.call(opts, options) if block.present?

      opts.on('-h', '--host ARG', String) { |host| options[:host] = host }
      opts.on('-p', '--port ARG', Integer) { |port| options[:port] = port }
      opts.on('-r', '--protocol ARG', String) { |protocol| options[:protocol] = protocol }
      opts.on('-a', '--api-key ARG', String) { |api_key| options[:api_key] = api_key }
      opts.on('-c', '--collection-name ARG', String) { |collection| options[:collection_name] = collection }

      args = opts.order!(args) {}
      opts.parse!(args)

      options
    end
  end
end