import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import $ from 'jquery';
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
    $.get(this.arrivalsUrl, function(data){
      const trips = JSON.parse(data);
      setState({trips: trips});
    });
    socket.on(stopNum + "/" + trips[0], function(data){
        this.setState({arrivals: [JSON.parse(data)]});
        console.log(data);
    }.bind(this));
  }

  componentWillUnmount() {
    if(this.serverRequest) {
      this.serverRequest.abort();
    }
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

    return (
    <div style={divStyle}>
      <h3 style={{width: '100%', textAlign:'center'}}>Arrivals for Route 1A at Stop 1</h3>
      {this.state.trips.map((trip) => {
        return <h2>OMG trip {trip.trip_id}</h2>
      })};
      <List>
        {this.createArrivalsList()}
      </List>

    </div>);
  }
}

export default StopArrivalTimes;
