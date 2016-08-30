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

export const unsubscribeFromStop = (stopId) => {
  return {
    type: actions.UNSUBSCRIBE_STOP_ARRIVALS,
    stopId
  };
};

export const clearShapes = () => {
  return {
    type: actions.CLEAR_SHAPES
  };
};
