class RoutesController < ApplicationController
protect_from_forgery

  def get_all_routes
    routes = Route.take(200)
    render :json => routes.to_json
  end

  def shapes_for_route
      route_id = params[:routeId]
      shapes = Shape.where(shape_id: route_id).order(shape_pt_sequence: :asc)
      render :json => shapes.to_json
  end
end
