class RoutesController < ApplicationController
protect_from_forgery

  def get_all_routes
    routes = Route.take(200)
    render :json => routes.to_json
  end

end
