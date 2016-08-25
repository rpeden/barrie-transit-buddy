import { actions, fetchStopsForRoute } from './actions.js'

const initialState = {
    routes: window.routes,
    stops: []
}

export function transitApp(state = initialState, action) {
    if(action.type === actions.FETCH_STOPS_FOR_ROUTE) {
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
