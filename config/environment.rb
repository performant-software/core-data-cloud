# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!

# Disable Rails lazy route loading. Without this, the first request returns a 404 in development environments
Rails.application.try(:reload_routes_unless_loaded) unless Rails.env.production?