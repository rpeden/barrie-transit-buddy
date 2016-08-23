class TripsController < ApplicationController
    include TransitHelper

  def trips_for_route_and_stop
    route_id = params[:route_id]
    stop_id  = params[:stop_id]
    service_id = compute_service_id.to_s
    res = {:route_id => route_id, :stop_id => stop_id, :service_id => service_id}
    trips = Trip.find_for_route_and_stop(route_id, stop_id, service_id)
    trip_arrival_times = [];

    current_time = Time.now
    comparison_time = Time.utc(2000,01,01,current_time.hour, current_time.min)

    trips.each do |trip|
        departure_split = trip.departure_time.split(":")
        departure_time = Time.utc(2000,01,01,departure_split[0].to_i, departure_split[1].to_i)
        seconds_to_departure = departure_time - comparison_time
        trip_arrival = {
            :trip_id => trip.trip_id,
            :departure_time => trip.departure_time,
            :seconds_to_departure => seconds_to_departure
        }
        trip_arrival_times.push(trip_arrival)
    end

    render :text => trip_arrival_times.to_json#trip_arrival_times.to_json
  end

end
