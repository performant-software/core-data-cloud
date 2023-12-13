Rails.application.routes.draw do
  mount CoreDataConnector::Engine => '/core_data'
  mount UserDefinedFields::Engine, at: '/user_defined_fields'

  # Default route for static front-end
  get '*path', to: "application#fallback_index_html", constraints: -> (request) do
    !request.xhr? && request.format.html?
  end
end
