import $ from 'jquery';
import store from './store.js'
import { toMinutesFromNow, timeToLocalDate } from '../utils/StringUtils';
import _ from 'lodash';
import socket from '../SocketIO.js';

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
    $.get(stopUrl, function (result) {
        const stops = JSON.parse(result);
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

    $.get(arrivalsUrl, function(data){
        const trips = JSON.parse(data) || [];

        var filteredTrips = _.chain(trips)
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
            //subscribeToStop();
            listenForData(trips[0].trip_id, stopId);
        }
    });
}

export const fetchShapesForRoute = (routeId) => {
    const shapesUrl = "/routes/" + routeId + "/shapes.json";
    $.get(shapesUrl, (data) => {
        const shapes = data || [];
        if(shapes.length > 0) {
            store.dispatch({
                type: actions.UPDATE_SHAPES,
                shapes: shapes.map((shape) => {
                    return new google.maps.LatLng(shape.shape_pt_lat, shape.shape_pt_lon);
                })
            });
        }
    });
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

        /*const updatedSeconds = departureTime.second();
         if(updatedSeconds > 30) {
         departureTime.add(1, 'minute');
         }*/

        const diffString = toMinutesFromNow(departureTime);

        trip["departureTime"] = diffString;//departureTime.format('h:mm a');

        //setState({trips: [].concat(trip).concat(updateArrivalTimes(rest)) });
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
