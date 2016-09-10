import { actions } from "./actions";

export const fetchStops = (routeId) => {
  return {
    type: actions.FETCH_STOPS_FOR_ROUTE,
    routeId
  };
};

export const fetchArrivalTimes = (routeId, stopId) => {
  return {
    type: actions.FETCH_ARRIVAL_TIMES,
    routeId,
    stopId
  };
};

export const fetchRouteShapes = (routeId) => {
  return {
    type: actions.FETCH_SHAPES_FOR_ROUTE,
    routeId
  };
};

export const subscribeToStop = (stopId) => {
  return {
    type: actions.SUBSCRIBE_STOP_ARRIVALS,
    stopId
  };
};

export const subscribeTripLocation = (tripId) => {
  return {
    type: actions.SUBSCRIBE_TRIP_LOCATION,
    tripId
  };
};

export const unsubscribeTripLocation = (tripId) => {
  return {
    type: actions.UNSUBSCRIBE_TRIP_LOCATION,
    tripId
  };
};

export const unsubscribeFromStop = (stopId) => {
  return {
    type: actions.UNSUBSCRIBE_STOP_ARRIVALS,
    stopId
  };
};

export const updateSelectedRoute = (routeId) => {
  return {
    type: actions.UPDATE_SELECTED_ROUTE,
    routeId
  };
};

export const updateSelectedStop = (stop) => {
  return {
    type: actions.UPDATE_SELECTED_STOP,
    selectedStop: stop
  };
};
export const clearShapes = () => {
  return {
    type: actions.CLEAR_SHAPES
  };
};

export const clearStops = () => {
  return {
    type: actions.CLEAR_STOPS
  };
};
