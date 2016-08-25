import { actions, fetchStopsForRoute, fetchArrivalTimes,
         subscribeToStop, unsubscribeFromStop } from './actions.js'

const initialState = {
    routes: window.routes,
    stops: [],
    arrivals: []
}

export function transitApp(state = initialState, action) {
    if(action.type === actions.FETCH_STOPS_FOR_ROUTE) {
        fetchStopsForRoute(action.routeId);
        return state;
    }
    if(action.type === actions.FETCH_ARRIVAL_TIMES) {
        fetchArrivalTimes(action.routeId, action.stopId);
        return state;
    }
    if(action.type === actions.CLEAR_STOPS) {
        return Object.assign({}, state, { stops: [] });
    }
    if(action.type === actions.UPDATE_STOPS) {
        return Object.assign({}, state, { stops: action.stops });
    }
    if(action.type === actions.UPDATE_ARRIVAL_TIMES) {
        return Object.assign({}, state, { arrivals: action.arrivals });
    }
    if(action.type === actions.SUBSCRIBE_STOP_ARRIVALS) {
        subscribeToStop(action.stopId);
        return state;
    }
    if(action.type === actions.UNSUBSCRIBE_STOP_ARRIVALS) {
        unsubscribeFromStop(action.stopId);
    }

    return state;
}

export default transitApp;
