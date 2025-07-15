# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!
Rails.application.try(:reload_routes_unless_loaded) unless Rails.env.production?