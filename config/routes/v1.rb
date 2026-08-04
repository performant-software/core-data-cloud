# Public V1 routes

namespace :public, only: [:index, :show] do
  namespace :v1 do
    resources :events do
      resources :events, only: :index
      resources :instances, only: :index
      resources :items, only: :index
      resources :manifests
      resources :media_contents, only: :index
      resources :organizations, only: :index
      resources :people, only: :index
      resources :places, only: :index
      resources :taxonomies, only: :index
      resources :works, only: :index
    end

    resources :instances do
      resources :events, only: :index
      resources :instances, only: :index
      resources :items, only: :index
      resources :manifests
      resources :media_contents, only: :index
      resources :organizations, only: :index
      resources :people, only: :index
      resources :places, only: :index
      resources :taxonomies, only: :index
      resources :works, only: :index
    end

    resources :items do
      resources :events, only: :index
      resources :instances, only: :index
      resources :items, only: :index
      resources :manifests
      resources :media_contents, only: :index
      resources :organizations, only: :index
      resources :people, only: :index
      resources :places, only: :index
      resources :taxonomies, only: :index
      resources :works, only: :index
    end

    resources :media_contents, only: :index

    resources :organizations do
      resources :events, only: :index
      resources :instances, only: :index
      resources :items, only: :index
      resources :manifests
      resources :media_contents, only: :index
      resources :organizations, only: :index
      resources :people, only: :index
      resources :places, only: :index
      resources :taxonomies, only: :index
      resources :works, only: :index
    end

    resources :people do
      resources :events, only: :index
      resources :instances, only: :index
      resources :items, only: :index
      resources :manifests
      resources :media_contents, only: :index
      resources :organizations, only: :index
      resources :people, only: :index
      resources :places, only: :index
      resources :taxonomies, only: :index
      resources :works, only: :index
    end

    resources :places do
      resources :events, only: :index
      resources :instances, only: :index
      resources :items, only: :index
      resources :manifests
      resources :media_contents, only: :index
      resources :organizations, only: :index
      resources :people, only: :index
      resources :places, only: :index
      resources :taxonomies, only: :index
      resources :works, only: :index
    end

    resources :projects, only: [] do
      get :descriptors, on: :member
    end

    resources :works do
      resources :events, only: :index
      resources :instances, only: :index
      resources :items, only: :index
      resources :manifests
      resources :media_contents, only: :index
      resources :organizations, only: :index
      resources :people, only: :index
      resources :places, only: :index
      resources :taxonomies, only: :index
      resources :works, only: :index
    end
  end
end