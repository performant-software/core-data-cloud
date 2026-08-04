# Reconciliation API routes

namespace :reconcile do
  get 'projects/:id', to: 'projects#show'
  post 'projects/:id', to: 'projects#show'
  get 'projects/:id/view/:record_id', to: 'projects#view'
end