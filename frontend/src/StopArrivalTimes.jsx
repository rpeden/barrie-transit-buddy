import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import $ from 'jquery';
import _ from 'lodash';
import socket from './SocketIO.js'



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

  componentDidMount() {
    let stopNum = this.state.stopNumber;
    socket.emit('stop-listen', stopNum);
    const setState = ::this.setState;

    const listenForData = () => {
        socket.on(stopNum + "/" + trips[0].trip_id, function(data){
            setState({arrivals: [JSON.parse(data)]});
            console.log(data);
        });
    }

    const subscribeToStop = () => {
        socket.emit('stop-subscribe', this.props.params.stopId);
    }

    $.get(this.arrivalsUrl, function(data){
        const trips = JSON.parse(data) || [];
        setState({trips: _.take(trips, 5)});
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
      return <ListItem key={trip.trip_id}
                primaryText={`${trip.departure_time}`}
                secondaryText="Scheduled" />
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

    const header = "Arrivals for Route" + this.props.params.routeId
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
