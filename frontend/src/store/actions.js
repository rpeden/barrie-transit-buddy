import store from "./store.js";
import { toMinutesFromNow, timeToLocalDate } from "../utils/StringUtils";
import _ from "lodash";
import socket from "../SocketIO.js";
import ShapeCache from "../utils/ShapeCache.js";
import { Times } from "../utils/Constants.js";

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
  SUBSCRIBE_TRIP_LOCATION: "SubscribeTripLocation",
  UNSUBSCRIBE_STOP_ARRIVALS: "UnsubscribeStopArrivals",
  UNSUBSCRIBE_TRIP_LOCATION: "UnsubscribeTripLocation",
  UPDATE_SELECTED_ROUTE: "UpdatedSelectedRoute",
  CLEAR_SELECTED_ROUTE: "ClearSelctedRoute"
};

const updateArrivalTimes = (trips) => {
  const updatedTrips = trips.map((trip) => {
    const updatedTime = toMinutesFromNow(timeToLocalDate(trip.scheduledString));
    return Object.assign(trip, { departureTime: updatedTime });
  });
  return updatedTrips;
};

const listenForData = (tripId, stopNum) => {
  socket.on(`trip${tripId}`, (data) => {
    // eslint-disable-next-line no-console
    console.log(`Trip ${tripId} location: ${JSON.stringify(data)}`);
  });
  socket.on(`${stopNum}/${tripId}`, (data) => {
    const bufferSize = 10;
    const trips = store.getState().app.arrivals;
    const arrival = JSON.parse(data);
    const trip = _.find(trips, (t) => t.tripId === tripId);
    const rest = _.filter(trips, (t) => t.tripId !== tripId);

    if (!trip.hasOwnProperty("delays")) {
      trip.delays = [];
    }
    if (trip.delays.length >= bufferSize) {
      trip.delays = _.take(trip.delays, bufferSize);
    }

    trip.delays.push(arrival.delay || Times.DEFAULT_DELAY_SECONDS);

    const departureTime = timeToLocalDate(trip.scheduledString);
    departureTime.add(_.mean(trip.delays), "seconds");

    const diffString = toMinutesFromNow(departureTime);

    trip.departureTime = diffString;//departureTime.format('h:mm a');

    store.dispatch({
      type: actions.UPDATE_ARRIVAL_TIMES,
      arrivals: [].concat(trip).concat(updateArrivalTimes(rest))
    });
  });
};

export const fetchStopsForRoute = function (routeId) {
  const stopUrl = `/routes/${routeId}/stops`;
  fetch(stopUrl).then((response) => response.json())
                  .then((stops) => {
                    store.dispatch({
                      type: actions.UPDATE_STOPS,
                      stops
                    });
                    store.dispatch({
                      type: actions.UPDATE_SELECTED_ROUTE,
                      routeId
                    });
                  });
};

export const fetchArrivalTimes = (routeId, stopId) => {
  const arrivalsUrl = (`/routes/${routeId}/stops/${stopId}/trips`);

  fetch(arrivalsUrl).then((data) => {
    return data.json();
  }).then((trips) => {
    const tripsToShowCount = 5;
    const filteredTrips = _.chain(trips)
              .take(tripsToShowCount)
              .map((trip) => {
                const scheduledTime =
                      toMinutesFromNow(timeToLocalDate(trip.departure_time));

                return {
                  scheduledString: trip.departure_time,
                  scheduledDepartureTime: scheduledTime,
                  departureTime: scheduledTime,
                  tripId: trip.trip_id
                };
              }).value();

    if (!_.isEmpty(trips)) {
      store.dispatch({
        type: actions.UPDATE_ARRIVAL_TIMES,
        arrivals: filteredTrips
      });
      listenForData(_.head(trips).trip_id, stopId);
    }
  });
};

const shapeCache = new ShapeCache();

export const fetchShapesForRoute = (shapeId) => {
  const updateShapes = (shapes) => {
    store.dispatch({
      type: actions.UPDATE_SHAPES,
      shapes: shapes.map((shape) => {
        // eslint-disable-next-line no-undef
        return new google.maps.LatLng(shape.shape_pt_lat, shape.shape_pt_lon);
      })
    });
  };

  if (shapeCache.get(shapeId)) {
    // workaround until adding redux-thunk or sagas
    setTimeout(() => {
      updateShapes(shapeCache.get(shapeId));
    }, 1); // eslint-disable-line no-magic-numbers
  } else {
    const shapesUrl = `/routes/${shapeId}/shapes.json`;
    fetch(shapesUrl).then((data) => data.json())
            .then((shapes) => {
              if (!_.isEmpty(shapes)) {
                shapeCache.set(shapeId, shapes);
                updateShapes(shapes);
              }
            });
  }
};
window.fetchShapes = fetchShapesForRoute;

export const subscribeToStop = (stopId) => {
  socket.emit("stop-subscribe", stopId);
};

export const subscribeToTripLocation = (tripId) => {
  socket.emit("trip-location-subscribe", tripId);
};

export const unsubscribeFromStop = (stopId) => {
  socket.emit("stop-unsubscribe", stopId);
};

export const unsubscribeFromTripLocation = (tripId) => {
  socket.emit("trip-location-unsubscribe", tripId);
};
