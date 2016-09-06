import { actions, fetchStopsForRoute, fetchArrivalTimes, fetchShapesForRoute,
         subscribeToStop, unsubscribeFromStop } from "./actions.js";

const initialState = {
  routes: window.routes,
  selectedRoute: "",
  stops: [],
  arrivals: [],
  shapes: []
};

// eslint-disable-next-line max-statements,complexity
export const transitApp = (state = initialState, action) => {
  if (action.type === actions.FETCH_STOPS_FOR_ROUTE) {
    fetchStopsForRoute(action.routeId);
    return state;
  }
  if (action.type === actions.FETCH_ARRIVAL_TIMES) {
    fetchArrivalTimes(action.routeId, action.stopId);
    return state;
  }
  if (action.type === actions.FETCH_SHAPES_FOR_ROUTE) {
    fetchShapesForRoute(action.routeId);
    return state;
  }
  if (action.type === actions.CLEAR_STOPS) {
    return Object.assign({}, state, { stops: [] });
  }
  if (action.type === actions.UPDATE_STOPS) {
    return Object.assign({}, state, { stops: action.stops });
  }
  if (action.type === actions.UPDATE_ARRIVAL_TIMES) {
    return Object.assign({}, state, { arrivals: action.arrivals });
  }
  if (action.type === actions.UPDATE_SELECTED_ROUTE) {
    return Object.assign({}, state, { selectedRoute: action.routeId });
  }
  if (action.type === actions.CLEAR_SELECTED_ROUTE) {
    return Object.assign({}, state, { selectedRoute: null });
  }
  if (action.type === actions.UPDATE_SHAPES) {
    return Object.assign({}, state, { shapes: action.shapes });
  }
  if (action.type === actions.SUBSCRIBE_STOP_ARRIVALS) {
    subscribeToStop(action.stopId);
    return state;
  }
  if (action.type === actions.UNSUBSCRIBE_STOP_ARRIVALS) {
    unsubscribeFromStop(action.stopId);
    return state;
  }

  return state;
};

export default transitApp;
