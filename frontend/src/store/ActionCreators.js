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

export const updateHighlightedStop = (stop) => {
  return {
    type: actions.UPDATE_HIGHLIGHTED_STOP,
    highlightedStop: stop
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

export const clearBusLocation = () => {
  return {
    type: actions.CLEAR_BUS_LOCATION
  };
};

export const clearHighlightedStop = () => {
  return {
    type: actions.CLEAR_HIGHLIGHTED_STOP
  };
};

export const clearSelectedStop = () => {
  return {
    type: actions.CLEAR_SELECTED_STOP
  };
};

export const removeNextArrival = () => {
  return {
    type: actions.REMOVE_NEXT_ARRIVAL
  };
};
