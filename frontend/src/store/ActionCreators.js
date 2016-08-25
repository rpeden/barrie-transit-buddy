import store from './store'
import { actions } from './actions'

export let fetchStops = (routeId) => {
    store.dispatch({
        type: actions.FETCH_STOPS_FOR_ROUTE,
        routeId: routeId
    });
}

export let fetchArrivalTimes = (routeId, stopId) => {
    store.dispatch({
        type: actions.FETCH_ARRIVAL_TIMES,
        routeId: routeId,
        stopId: stopId
    })
}
