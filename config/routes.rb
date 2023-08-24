Rails.application.routes.draw do
  mount JwtAuth::Engine => '/auth'

  namespace :api do
    resources :projects
    resources :users
  end

  # Default route for static front-end
  get '*path', to: "application#fallback_index_html", constraints: -> (request) do
    !request.xhr? && request.format.html?
  end
end
