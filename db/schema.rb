# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20120625160937) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "routes", force: :cascade do |t|
    t.string "route_id"
    t.string "route_short_name"
  end

  add_index "routes", ["route_id"], name: "index_routes_on_route_id", using: :btree

  create_table "stop_times", force: :cascade do |t|
    t.string "stop_id"
    t.string "trip_id"
    t.time   "departure_time"
  end

  add_index "stop_times", ["stop_id", "departure_time"], name: "index_stop_times_on_stop_id_and_departure_time", using: :btree

  create_table "stops", force: :cascade do |t|
    t.string "stop_id"
    t.string "stop_name"
    t.float  "stop_lat"
    t.float  "stop_lon"
  end

  add_index "stops", ["stop_id"], name: "index_stops_on_stop_id", using: :btree
  add_index "stops", ["stop_lat", "stop_lon"], name: "index_stops_on_stop_lat_and_stop_lon", using: :btree

  create_table "trips", force: :cascade do |t|
    t.string  "trip_id"
    t.string  "route_id"
    t.string  "service_id"
    t.string  "trip_headsign"
    t.integer "block_id"
  end

  add_index "trips", ["trip_id"], name: "index_trips_on_trip_id", using: :btree

end
