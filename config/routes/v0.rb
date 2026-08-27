# Public V0 routes

namespace :public, only: [:index, :show] do
  resources :instances, controller: 'v0/instances' do
    resources :instances, only: :index, controller: 'v0/instances'
    resources :items, only: :index, controller: 'v0/items'
    resources :manifests, controller: 'v0/manifests'
    resources :media_contents, only: :index, controller: 'v0/media_contents'
    resources :organizations, only: :index, controller: 'v0/organizations'
    resources :people, only: :index, controller: 'v0/people'
    resources :places, only: :index, controller: 'v0/places'
    resources :taxonomies, only: :index, controller: 'v0/taxonomies'
    resources :works, only: :index, controller: 'v0/works'
  end

  resources :items, controller: 'v0/items' do
    resources :instances, only: :index, controller: 'v0/instances'
    resources :items, only: :index, controller: 'v0/items'
    resources :manifests, controller: 'v0/manifests'
    resources :media_contents, only: :index, controller: 'v0/media_contents'
    resources :organizations, only: :index, controller: 'v0/organizations'
    resources :people, only: :index, controller: 'v0/people'
    resources :places, only: :index, controller: 'v0/places'
    resources :taxonomies, only: :index, controller: 'v0/taxonomies'
    resources :works, only: :index, controller: 'v0/works'
  end

  resources :places, controller: 'v0/linked_places/places' do
    resources :instances, only: :index, controller: 'v0/linked_places/instances'
    resources :items, only: :index, controller: 'v0/linked_places/items'
    resources :manifests, controller: 'v0/manifests'
    resources :media_contents, only: :index, controller: 'v0/linked_places/media_contents'
    resources :organizations, only: :index, controller: 'v0/linked_places/organizations'
    resources :people, only: :index, controller: 'v0/linked_places/people'
    resources :places, only: :index, controller: 'v0/linked_places/places'
    resources :taxonomies, only: :index, controller: 'v0/linked_places/taxonomies'
    resources :works, only: :index, controller: 'v0/linked_places/works'
  end

  resources :projects, only: [] do
    get :descriptors, on: :member, controller: 'v0/projects'
  end

  resources :works, controller: 'v0/works' do
    resources :instances, only: :index, controller: 'v0/instances'
    resources :items, only: :index, controller: 'v0/items'
    resources :manifests, controller: 'v0/manifests'
    resources :media_contents, only: :index, controller: 'v0/media_contents'
    resources :organizations, only: :index, controller: 'v0/organizations'
    resources :people, only: :index, controller: 'v0/people'
    resources :places, only: :index, controller: 'v0/places'
    resources :taxonomies, only: :index, controller: 'v0/taxonomies'
    resources :works, only: :index, controller: 'v0/works'
  end
end