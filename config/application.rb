require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

require 'rgeo/active_record'

require_relative '../lib/canonical_domain_redirect'
require_relative '../lib/core_data_connector'

module RailsReactTemplate
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # Redirect requests for non-canonical domains before any other processing.
    config.middleware.insert_before 0, CanonicalDomainRedirect

    # Allow cross-origin reads of the public and reconciliation APIs. Inserted
    # after CanonicalDomainRedirect to preserve the ordering these had while
    # Rack::Cors was contributed by the core_data_connector engine.
    config.middleware.insert_after CanonicalDomainRedirect, Rack::Cors do
      allow do
        origins '*'
        resource '/core_data/public/*', methods: :get
        resource '/core_data/reconcile/*', methods: [:get, :post]
      end
    end

    # Configure Postmark for transactional emails
    config.action_mailer.delivery_method = :postmark
    config.action_mailer.postmark_settings = { :api_token => ENV['POSTMARK_API_TOKEN'] }
  end
end
