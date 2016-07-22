class StopTimesController < ApplicationController
protect_from_forgery

def upcoming_buses
     
    current_time = (Time.now).strftime("%H:%M:%S")
    future_time = (Time.now + 1800).strftime("%H:%M:%S") #current time plus 30 minutes
    day_type = compute_day()
    stop_times_array = Array.new
    
    stoptimes = get_stops(day_type,params[:stop_id],current_time,future_time, params[:route_id])
    stoptimes.each do |row|
           stop_times_array.push(:route_short_name => row.route_short_name, 
                                 :route_id => row.route_id,
                                 :trip_id => row.trip_id,
                                 :departure_time =>  row.departure_time.strftime("%H:%M:%S"), 
                                 :trip_headsign => row.route_long_name)
    end
    
    render :text => stop_times_array.to_json
    
  end

private  

  def get_stops(day_type, stop_id, current_time, future_time, route_id)
      if (future_time_is_today?) then
          return StopTime.find_same_day(day_type,stop_id,current_time,future_time, params[:route_id])  
      else
          return StopTime.find_across_days(day_type,stop_id,current_time,future_time)    
      end  
  end
  
  def compute_day
    if (Time.now.wday < 6)
      return 1
    elsif (Time.now.wday == 6)
      return 2
    elsif (Time.now.wday == 7)
      return 3 
    end
  end
  
  def future_time_is_today?
    ((Time.now + 1800).wday == Time.now.wday) ? true : false
  end
  
  def next_day_same_type?
    
    
  end


end