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
end