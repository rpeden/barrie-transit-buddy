Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".
  root 'home#index'
  get 'main' => 'home#main'
  get 'transit' => 'transit#index'
  get 'routes' => 'routes#get_all_routes'
  get 'routes/:routeId/shapes' => 'routes#shapes_for_route'
  get 'routes/:routeId/stops' => 'stops#stops_for_route'
  get 'routes/:route_id/stops/:stop_id/trips' => 'trips#trips_for_route_and_stop'
  get 'stops' => 'stops#fetch_stops'
  get 'stops/:stopId/routes' => 'stops#routes_for_stop'
  get 'stop_times/:stop_id' => 'stop_times#upcoming_buses'
  get 'home' => 'home#index'
  get 'mobile' => "mobile#index"
  get 'mobile/stops' => "mobile#stops"
  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
