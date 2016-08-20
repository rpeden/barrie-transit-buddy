class Trip < ActiveRecord::Base

	def self.find_for_route_and_stop(route_id, stop_id, service_id)
		current_time = (Time.now - 60).strftime("%H:%M:%S")

		self.find_by_sql ["select tr.trip_id, st.departure_time from stop_times as st
            inner join trips as tr on st.trip_id = tr.trip_id
            inner join routes as rt on rt.route_id = tr.route_id
            where st.stop_id = ?
            and rt.route_id = ?
            and tr.service_id = ? /* look up weekday, sat/sun values for Barrie Transit */
            and departure_time > ?;",
                             stop_id, route_id, service_id, current_time]
	end

end
