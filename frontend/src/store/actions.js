import store from './store.js'
import { toMinutesFromNow, timeToLocalDate } from '../utils/StringUtils';
import _ from 'lodash';
import socket from '../SocketIO.js';
import ShapeCache  from '../utils/ShapeCache.js';

export const actions = {
    FETCH_STOPS_FOR_ROUTE: "FetchStopsForRoute",
    FETCH_ARRIVAL_TIMES: "FetchStopTimes",
    FETCH_SHAPES_FOR_ROUTE: "FetchShapesForRoute",
    UPDATE_STOPS: "UpdateStops",
    UPDATE_ARRIVAL_TIMES: "UpdateArrivalTimes",
    UPDATE_SHAPES: "UpdateShapes",
    CLEAR_STOPS: "ClearStops",
    CLEAR_SHAPES: "ClearShapes",
    SUBSCRIBE_STOP_ARRIVALS: "SubscribeStopArrivals",
    UNSUBSCRIBE_STOP_ARRIVALS: "UnsubscribeStopArrivals"
}

export const fetchStopsForRoute = function(routeId) {
    const stopUrl = "/routes/" + routeId + "/stops";
    fetch(stopUrl).then((response) => response.json())
                  .then(function(stops) {
                        store.dispatch({
                            type: actions.UPDATE_STOPS,
                            stops: stops
                        })
                  });
}

export const fetchArrivalTimes = (routeId, stopId) => {
    const arrivalsUrl = ("/routes/" + routeId
        + "/stops/"
        + stopId
        + "/trips");

    fetch(arrivalsUrl).then((data) => {
        return data.json();
    }).then((trips) => {
        const filteredTrips = _.chain(trips)
              .take(5)
              .map(trip => {
                  let scheduledTime =
                      toMinutesFromNow(timeToLocalDate(trip.departure_time))

                    return {
                        scheduledString: trip.departure_time,
                        scheduledDepartureTime: scheduledTime,
                        departureTime: scheduledTime,
                        tripId: trip.trip_id
                    };
            }).value();

        if (trips.length > 0) {
            store.dispatch({
                type: actions.UPDATE_ARRIVAL_TIMES,
                arrivals: filteredTrips
            })
            listenForData(trips[0].trip_id, stopId);
        }
    })
}

let shapeCache = new ShapeCache();

export const fetchShapesForRoute = (shapeId) => {
    const updateShapes = (shapes) => {
        store.dispatch({
            type: actions.UPDATE_SHAPES,
            shapes: shapes.map((shape) => {
                return new google.maps.LatLng(shape.shape_pt_lat, shape.shape_pt_lon);
            })
        });
    }

    if(shapeCache.get(shapeId)) {
        setTimeout(() => {
            updateShapes(shapeCache.get(shapeId));
        }, 1);
    } else {
        const shapesUrl = "/routes/" + shapeId + "/shapes.json";
        fetch(shapesUrl).then(data => data.json())
            .then((shapes) => {
                if(shapes.length > 0) {
                    shapeCache.set(shapeId, shapes);
                    updateShapes(shapes);
                }
            })
    }
}
window.fetchShapes = fetchShapesForRoute;

const listenForData = (tripId, stopNum) => {

    socket.on(stopNum + "/" + tripId, function(data){
        const bufferSize = 10;
        const trips = store.getState().arrivals;
        const arrival = JSON.parse(data);
        const trip = _.find(trips, (trip) => trip.tripId == tripId);
        const rest = _.filter(trips, (trip) => trip.tripId != tripId)

        if(!trip.hasOwnProperty("delays")) {
            trip["delays"] = [];
        }
        if(trip["delays"].length >= bufferSize) {
            trip["delays"] = _.take(trip["delays"], bufferSize);
        }
        trip["delays"].push(arrival.delay || 0);

        const departureTime = timeToLocalDate(trip.scheduledString);
        departureTime.add(_.mean(trip["delays"]), 'seconds');

        const diffString = toMinutesFromNow(departureTime);

        trip["departureTime"] = diffString;//departureTime.format('h:mm a');

        store.dispatch({
            type: actions.UPDATE_ARRIVAL_TIMES,
            arrivals: [].concat(trip).concat(updateArrivalTimes(rest))
        });
        console.log(data);
    });
}

const updateArrivalTimes = (trips) => {
    const updatedTrips = trips.map((trip) => {
        const updatedTime = toMinutesFromNow(timeToLocalDate(trip.scheduledString));
        return Object.assign(trip, { departureTime: updatedTime })
    });
    return updatedTrips;
}

export const subscribeToStop = (stopId) => {
    socket.emit('stop-subscribe', stopId);
}

export const unsubscribeFromStop = (stopId) => {
    socket.emit('stop-unsubscribe', stopId);
}
