import { Component } from 'react';
import React from 'react';
import {Table, TableBody, TableHeader
        ,TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import HeightResizingComponent from './HeightResizingComponent.jsx';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import $ from 'jquery';
import _ from 'lodash';
import socket from './SocketIO.js';
import moment from '../vendor/moment-timezone';
import { hashHistory } from 'react-router';

//separate these out into own module
const timeToLocalDate = (timeString, delay=0) => {
    const timeSplit = timeString.split(':');

    let tz = moment.tz('America/Toronto').hours(timeSplit[0])
                                         .minutes(timeSplit[1])
                                         .add(delay, 'seconds');

    if(timeSplit.length > 2) {
        tz.seconds(timeSplit[2]);
    }

    return tz;
}

const pluralize = (count, singluar, plural) => {
    if(count == 1) {
        return singluar;
    }
    return plural;
}

const toMinutesFromNow = (futureDate) => {
    const currentTime = moment.tz('America/Toronto');
    let timeDiffSeconds = Math.floor(futureDate.diff(currentTime) / 1000);
    const timeDiffHours   = Math.floor(timeDiffSeconds / 3600);
    //floor because we already account for extra minutes
    //probably ok to just round here and avoid seconds check elsewhere
    //but write tests to verify
    const timeDiffMinutes = Math.floor((timeDiffSeconds - (3600*timeDiffHours))/ 60);


    const diffString = `${timeDiffHours > 0 ? `${timeDiffHours}h ` : ''}` +
                       `${timeDiffMinutes} min`;
    return diffString;
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
        const updateArrivalTimes = ::this.updateArrivalTimes;

        socket.on(stopNum + "/" + tripId, function(data){
            const bufferSize = 10;
            const trips = getState().trips;
            const arrival = JSON.parse(data);
            const trip = _.find(trips, (trip) => trip.tripId == tripId);
            const rest = _.filter(trips, (trip) => trip.tripId != tripId)

            if(!trip.hasOwnProperty("delays")) {
                trip["delays"] = [];
            }
            if(trip["delays"].length >= bufferSize) {
                trip["delays"] = _.take(trip["delays"], bufferSize);
            }
            trip["delays"].push(arrival.delay || 0);

            const departureTime = timeToLocalDate(trip.scheduledString);
            departureTime.add(_.mean(trip["delays"]), 'seconds');

            /*const updatedSeconds = departureTime.second();
            if(updatedSeconds > 30) {
                departureTime.add(1, 'minute');
            }*/

            const diffString = toMinutesFromNow(departureTime);

            trip["departureTime"] = diffString;//departureTime.format('h:mm a');


            setState({trips: [].concat(trip).concat(updateArrivalTimes(rest)) });
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
                                 let scheduledTime =
                                    toMinutesFromNow(timeToLocalDate(trip.departure_time))

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

  updateArrivalTimes(trips) {
      const updatedTrips = trips.map((trip) => {
          const updatedTime = toMinutesFromNow(timeToLocalDate(trip.scheduledString));
          return Object.assign(trip, { departureTime: updatedTime })
      });
      return updatedTrips;
  }

  createArrivalsList() {
    return this.state.trips.map((trip) => {
        let text = "Scheduled";
        if (trip.delays) {
            const bufferedDelay = _.mean(trip.delays);
            const onTime = bufferedDelay <= 29;
            const early = bufferedDelay <= -29;

            if (onTime) {
                text = "On Time"
            } else if (early) {
                let delay = Math.round(bufferedDelay / -60);
                text = `${delay} ${pluralize(delay,'min','mins')} early`;
            } else {
                let delay = Math.round(bufferedDelay / 60);
                text = `${delay} ${pluralize(delay,'min','mins')} late`;
            }
        }

        const rowStyle = {
            fontSize: '16px'
        }

        const column = (text) => <TableRowColumn style={rowStyle}>{text}</TableRowColumn>;

        return (
                <TableRow key={trip.tripId}>
                    {column(trip.departureTime)}
                    {column(text)}
                </TableRow>
        );
    });
  }

  onBackClick() {
    setTimeout(() => {
      hashHistory.goBack();
    }, 350);
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

    const tableHeaderStyle = {
        fontSize: '19px'
    }

    const headerColorStyle = {
        color: 'rgba(0,0,0,0.65)'
    }

    const routeStyle = Object.assign({}, headerColorStyle, { fontSize: '20px' });
    const stopStyle  = Object.assign({}, headerColorStyle,
                                     { fontSize: '16px', marginTop: '5px' });

    return (
        <div style={divStyle}>
            <Toolbar style={{justifyContent:'auto'}}>
              <ToolbarGroup firstChild={true}>
                <IconButton onClick={::this.onBackClick} style={{marginTop:'5px'}}>
                  <NavigationArrowBack />
                </IconButton>
              </ToolbarGroup>
              <ToolbarGroup lastChild={true} style={{alignSelf: 'center'}}>
                <div>
                    <div style={routeStyle}>{"Route " + this.props.params.routeId}</div>
                    <div style={stopStyle}>{"Stop " + this.props.params.stopId}</div>
                </div>
              </ToolbarGroup>
            </Toolbar>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={tableHeaderStyle}>
                    Arriving In
                </TableHeaderColumn>
                <TableHeaderColumn style={tableHeaderStyle}>
                    Status
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {this.createArrivalsList()}
            </TableBody>
          </Table>
        </div>
    );
  }
}

export default StopArrivalTimes;
