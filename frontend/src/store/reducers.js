import $ from 'jquery';
import store from './store.js'

const initialState = {
    routes: window.routes,
    stops: []
}

const actions = {
    FETCH_STOPS_FOR_ROUTE: "FetchStopsForRoute",
    UPDATE_STOPS: "UpdateStops",
    CLEAR_STOPS: "ClearStops",
}

let fetchStopsForRoute = function(routeId) {

    $.get(this.stopUrl, function (result) {
          const stops = JSON.parse(result);
          store.dispatch({
              type: actions.UPDATE_STOPS,
              stops: stops
          })
      });
}

export function transitApp(state = initialState, action) {
    if(action.type === actions.FETCH_STOPS) {
        fetchStopsForRoute(action.routeId);
        return state;
    }
    if(action.type === actions.CLEAR_STOPS) {
        return Object.assign({}, state, { stops: [] });
    }
    if(action.type === actions.UPDATE_STOPS) {
        return Object.assign({}, state, { stops: action.stops })
    }
    return state;
}

export default transitApp;
