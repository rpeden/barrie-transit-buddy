import $ from 'jquery';
import store from './store.js'

export const actions = {
    FETCH_STOPS_FOR_ROUTE: "FetchStopsForRoute",
    FETCH_ARRIVAL_TIMES: "FetchStopTimes",
    UPDATE_STOPS: "UpdateStops",
    CLEAR_STOPS: "ClearStops",
}

export let fetchStopsForRoute = function(routeId) {
    const stopUrl = "/routes/" + routeId + "/stops";
    $.get(stopUrl, function (result) {
        const stops = JSON.parse(result);
        store.dispatch({
            type: actions.UPDATE_STOPS,
            stops: stops
        })
    });
}


export let fetchArrivalTimes = (routeId, stopId) => {

}