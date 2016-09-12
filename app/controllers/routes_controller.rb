class RoutesController < ApplicationController
protect_from_forgery

  def get_all_routes
    routes = Route.take(200)
    render :json => routes.to_json
  end

  def shapes_for_route
      route_id = correct_shape_id(params[:routeId])
      shapes = Shape.where(shape_id: route_id).order(shape_pt_sequence: :asc)
      render :json => shapes.to_json
  end

  private
  # most shape ids correspond to shape id, but a couple do not.
  # this method checks and corrects. should probably move mappings to
  # an external yaml or json to make it easily upgradable without full
  # redeploy
  def correct_shape_id(route_id)
    shape_to_route_map = {
      "21" => "20",
      "10" => "9"
    }

    shape_to_route_map[route_id] || route_id
  end
end
