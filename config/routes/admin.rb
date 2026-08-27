# Admin CMS routes

concern :manifestable do
  post :create_manifests, on: :member
end

concern :mergeable do
  post :merge, on: :collection
end

concern :publishable do
  post :publish, on: :member
end

concern :versionable do
  resources :versions, only: [:index]
end

resources :events, concerns: [:manifestable, :mergeable, :publishable, :versionable]

resources :instances, concerns: [:manifestable, :mergeable, :publishable, :versionable]

resources :items, concerns: [:manifestable, :mergeable, :publishable, :versionable] do
  get :analyze_import, on: :member
  post :import, on: :member
end

resources :jobs, only: [:destroy, :index]

resources :media_contents, concerns: [:manifestable, :mergeable, :publishable, :versionable] do
  post :upload, on: :collection
end

resources :organizations, concerns: [:manifestable, :mergeable, :publishable, :versionable]

resources :people, concerns: [:manifestable, :mergeable, :publishable, :versionable]

resources :places, concerns: [:manifestable, :mergeable, :publishable, :versionable]

resources :project_models do
  get :model_classes, on: :collection
end

resources :project_model_accesses, only: :index

resources :projects, concerns: [:versionable] do
  post :analyze_import, on: :member
  post :clear, on: :member
  get :export_configuration, on: :member
  get :export_data, on: :member
  get :export_variables, on: :member
  post :import_analyze, on: :member
  post :import_configuration, on: :member
  post :import_data, on: :member
  get :map_library, on: :member
end

resources :record_merges, only: [:index, :destroy]

resources :relationships do
  post :upload, on: :collection
end

resources :taxonomies, concerns: [:manifestable, :mergeable, :publishable, :versionable]

resources :user_projects do
  post :invite, on: :member
end

resources :users do
  post :invite, on: :member
  get :me, on: :collection
end

resources :web_authorities do
  get :find, on: :member
  get :search, on: :member
end

resources :web_identifiers

resources :works, concerns: [:manifestable, :mergeable, :publishable, :versionable]

