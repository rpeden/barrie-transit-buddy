class TripsController < ApplicationController
protect_from_forgery

  def trips_for_route_and_stop
    route_id = params[:route_id]
    stop_id  = params[:stop_id]
    service_id = params[:service_id] || "1"
    res = {:route_id => route_id, :stop_id => stop_id, :service_id => service_id}
    trips = Trip.find_for_route_and_stop(route_id, stop_id, service_id)
    render :text => trips.to_json
  end

end
