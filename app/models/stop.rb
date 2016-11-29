class Stop < ActiveRecord::Base
	has_many :stop_times
	validates :stop_id, :stop_name, :stop_lat, :stop_lon, :presence => true
	validates :stop_lat, :stop_lon, :numericality => true
end
