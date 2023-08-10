Rails.application.routes.draw do
  mount ControlledVocabulary::Engine, at: "/controlled_vocabulary"

  namespace :api do
    resources :users

    # Authentication
    post '/auth/login', to: 'authentication#login'

    # Default route for static front-end
    get '*path', to: "application#fallback_index_html", constraints: -> (request) do
      !request.xhr? && request.format.html?
    end
  end
end
