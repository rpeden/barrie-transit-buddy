import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import $ from 'jquery';
import _ from 'lodash';
import socket from './SocketIO.js';
import moment from 'moment-timezone';

const timeToLocalDate = function(timeString) {
    const timeSplit = timeString.split(':');
    let tz = moment.tz('America/Toronto').hours(timeSplit[0])
                                         .minutes(timeSplit[1]);
    if(timeSplit.length > 2) {
        tz.seconds(timeSplit[2]);
    }

    return tz;
}

class StopArrivalTimes extends HeightResizingComponent {

  constructor(props) {
    super(props);
    this.state = {
      stopNumber: this.props.params.stopId,
      routeId: this.props.params.routeId,
      trips: [],
      arrivals: [],
      height: window.innerHeight - 64 + "px"
    };
    this.arrivalsUrl = ("/routes/" + this.props.params.routeId
                                   + "/stops/"
                                   + this.props.params.stopId
                                   + "/trips");
  }

  getState() {
      return this.state;
  }

  componentDidMount() {
    let stopNum = this.state.stopNumber;

    const setState = ::this.setState;
    const updateArrivals = ::this.updateArrivalTimes;
    const getState = ::this.getState;

    const getBufferSize = (secondsToDeparture) => {
        if(secondsToDeparture > 500) {
            //more than 5 minutes out, use mean of last 10
            return 10;
        } else if (secondsToDeparture > 180) {
            return 5;
        } else {
            return 2;
        }

    }

    const listenForData = () => {
        const tripId = this.state.trips[0].tripId;

        socket.on(stopNum + "/" + tripId, function(data){
            const bufferSize = 10;
            const trips = getState().trips;
            const arrival = JSON.parse(data);
            const trip = _.find(trips, (trip) => trip.tripId == tripId);
            const rest = _.filter(trips, (trip) => trip.tripId != tripId)
            const currentTime = moment.tz('America/Toronto');

            const departureSplit = trip.scheduledString.split(':');

            const departureTime = moment.tz('America/Toronto')
                                      .hour(departureSplit[0])
                                      .minute(departureSplit[1])
                                      .add(arrival.delay || 0, 'seconds')

            const updatedSeconds = departureTime.second();

            if(updatedSeconds > 30) {
                departureTime.add(1, 'minute');
            }

            trip["departureTime"] = departureTime.format('hh:mm a');

            if(!trip.hasOwnProperty("delays")) {
                trip["delays"] = [];
            }
            if(trip["delays"].length >= bufferSize) {
                trip["delays"] = _.take(trip["delays"], bufferSize);
            }
            trip["delays"].push(arrival.delay || 0);

            setState({trips: [].concat(trip).concat(rest) });
            console.log(data);
        });
    }

    const subscribeToStop = () => {
        socket.emit('stop-subscribe', this.props.params.stopId);
    }

    $.get(this.arrivalsUrl, function(data){

        const trips = JSON.parse(data) || [];

        var filteredTrips = _.chain(trips)
                             .take(5)
                             .map(trip => {
                                 let scheduledTime = timeToLocalDate(trip.departure_time)
                                                        .format('h:mm a');
                                 return {
                                     scheduledString: trip.departure_time,
                                     scheduledDepartureTime: scheduledTime,
                                     departureTime: scheduledTime,
                                     tripId: trip.trip_id
                                 };
                             }).value();

        setState({trips: filteredTrips});
        if (trips.length > 0) {
            subscribeToStop();
            listenForData();
        }
    });
  }

  componentWillUnmount() {
    if(this.serverRequest) {
      this.serverRequest.abort();
    }
    socket.emit('stop-unsubscribe', this.props.params.stopId);
  }

  updateArrivalTimes() {

  }

  createArrivalsList() {
    return this.state.trips.map((trip) => {
        let text = "Scheduled";
        if (trip.delays) {
            const bufferedDelay = _.mean(trip.delays);
            const onTime = bufferedDelay <= 30;
            const early = bufferedDelay <= -30;

            if (onTime) {
                text = "On Time"
            } else if (early) {
                let minutes = Math.floor(bufferedDelay / 60);
                text = `${minutes} minutes early`;
            } else {
                let minutes = Math.floor(bufferedDelay / 60);
                text = `${minutes} minutes late`;
            }
        }

        return <ListItem key={trip.tripId}
                    primaryText={`${trip.departureTime}`}
                    secondaryText={text} />
    });
  }

  render() {
    const divStyle = {
      width: '300px',
      height: this.state.height,
      maxHeight: this.state.height,
      boxShadow: '5px 0px 11px -7px rgba(0,0,0,0.50)',
      zIndex: 10,
      backgroundColor: 'white',
      color: 'black',
      overflow: 'auto'
    }

    const header = "Arrivals for Route " + this.props.params.routeId
                                        + " at Stop "
                                        + this.props.params.stopId;

    return (
    <div style={divStyle}>
      <h3 style={{width: '100%', textAlign:'center'}}>{header}</h3>
      <List>
        {this.createArrivalsList()}
      </List>

    </div>);
  }
}

export default StopArrivalTimes;
