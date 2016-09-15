import { actions, fetchStopsForRoute, fetchArrivalTimes, fetchShapesForRoute,
         subscribeToStop, unsubscribeFromStop, subscribeToTripLocation,
         unsubscribeFromTripLocation } from "./actions.js";
import _ from "lodash";

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
  if (action.type === actions.UPDATE_SELECTED_STOP) {
    return Object.assign({}, state, {
      selectedStop: action.selectedStop,
      stops: [action.selectedStop]}
    );
  }
  if (action.type === actions.UPDATE_BUS_LOCATION) {
    return Object.assign({}, state, { busLocation: action.busLocation });
  }
  if (action.type === actions.UPDATE_HIGHLIGHTED_STOP) {
    return Object.assign({}, state, { highlightedStop: action.highlightedStop});
  }
  if (action.type === actions.CLEAR_SELECTED_STOP) {
    return Object.assign({}, state, { selectedStop: undefined });
  }
  if (action.type === actions.CLEAR_HIGHLIGHTED_STOP) {
    return Object.assign({}, state, { highlightedStop: undefined });
  }
  if (action.type === actions.CLEAR_SELECTED_ROUTE) {
    return Object.assign({}, state, { selectedRoute: null });
  }
  if (action.type === actions.CLEAR_BUS_LOCATION) {
    return Object.assign({}, state, { busLocation: null });
  }
  if (action.type === actions.UPDATE_SHAPES) {
    return Object.assign({}, state, { shapes: action.shapes });
  }
  if (action.type === actions.SUBSCRIBE_STOP_ARRIVALS) {
    subscribeToStop(action.stopId);
    return state;
  }
  if (action.type === actions.SUBSCRIBE_TRIP_LOCATION) {
    subscribeToTripLocation(action.tripId);
  }
  if (action.type === actions.UNSUBSCRIBE_STOP_ARRIVALS) {
    unsubscribeFromStop(action.stopId);
    return state;
  }
  if (action.type === actions.UNSUBSCRIBE_TRIP_LOCATION) {
    unsubscribeFromTripLocation(action.tripId);
  }
  if (action.type === actions.REMOVE_NEXT_ARRIVAL) {
    return Object.assign({}, state, { arrivals: _.tail(state.arrivals) });
  }
  return state;
};

export default transitApp;
