class Route < ActiveRecord::Base
	belongs_to :stop_times

	def self.find_routes_for_stop(stop_id)
		self.find_by_sql ["select distinct rt.route_id, rt.route_long_name
							from routes as rt
							inner join trips as tr
							on rt.route_id = tr.route_id
							inner join stop_times as st
							on st.trip_id = tr.trip_id
							where st.stop_id = ?
							order by rt.route_long_name",
                               stop_id]
	end

	def self.find_stops_for_route(route_id)
		self.find_by_sql ["select distinct stops.stop_id, stop_name, stop_lat, stop_lon
							from stops 
    					inner join stop_times as st
					    on stops.stop_id = st.stop_id
					    inner join trips as tr
					    on st.trip_id = tr.trip_id
					    inner join routes as rt
					    on tr.route_id = rt.route_id
					    where rt.route_id = ?", route_id]
	end
end
