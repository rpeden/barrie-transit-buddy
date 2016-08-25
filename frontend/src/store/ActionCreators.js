import store from './store'
import { actions } from './actions'

export const fetchStops = (routeId) => {
    store.dispatch({
        type: actions.FETCH_STOPS_FOR_ROUTE,
        routeId: routeId
    });
}

export const fetchArrivalTimes = (routeId, stopId) => {
    return {
        type: actions.FETCH_ARRIVAL_TIMES,
        routeId: routeId,
        stopId: stopId
    }
}

export const subscribeToStop = (stopId) => {
    return {
        type: actions.SUBSCRIBE_STOP_ARRIVALS,
        stopId: stopId
    }
}

export const unsubscribeFromStop = (stopId) => {
    return {
        type: actions.UNSUBSCRIBE_STOP_ARRIVALS,
        stopId: stopId
    }
}
