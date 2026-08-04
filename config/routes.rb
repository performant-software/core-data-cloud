require 'rack/session/cookie'
require 'sidekiq/web'

# Enable Rack session middleware only for Sidekiq Web UI
Sidekiq::Web.use Rack::Session::Cookie, secret: Rails.application.credentials.secret_key_base, same_site: :lax, max_age: 86400

# Add Basic Authentication for Security
Sidekiq::Web.use Rack::Auth::Basic do |email, password|
  user = CoreDataConnector::User.find_by(email:,)
  policy = CoreDataConnector::UserPolicy.new(user, user)

  user.present? && policy.jobs? && user.authenticate(password)
end

Rails.application.routes.draw do
  # Preserve `/core_data/**` API routes from the old connector gem
  scope path: 'core_data', module: 'core_data_connector' do
    # JWT authentication
    mount JwtAuth::Engine, at: '/auth'

    # Admin API endpoints
    draw(:admin)

    # Public API endpoints
    draw(:v0)
    draw(:v1)

    # Reconciliation API endpoints
    draw(:reconcile)
  end

  mount Sidekiq::Web, at: '/sidekiq'
  mount TripleEyeEffable::Engine, at: '/triple_eye_effable'
  mount UserDefinedFields::Engine, at: '/user_defined_fields'

  # Default route for static front-end
  get '*path', to: "application#fallback_index_html", constraints: -> (request) do
    !request.xhr? && request.format.html?
  end
end
