# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!

# Disable Rails lazy route loading. Without this, the first request returns a 404 in development environments
Rails.application.try(:reload_routes_unless_loaded) unless Rails.env.production?

Rails.application.routes.default_url_options[:protocol] = 'https' if Rails.application.config.force_ssl
Rails.application.routes.default_url_options[:host] = ENV['HOSTNAME']