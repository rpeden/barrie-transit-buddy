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
      stopNumber: 1,
      routeId: 1,
      arrivals: [],
      height: window.innerHeight - 64 + "px"
    };
    this.arrivalsUrl = "/routes/1/stops";
  }

  componentDidMount() {
    let stopNum = this.state.stopNumber;
    socket.emit('stop-listen', stopNum);
    socket.on(stopNum + "/7", function(data){
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
    return this.state.arrivals.map((arrival) => {
      return <ListItem key={arrival.tripId} primaryText={`${arrival.tripId}  -  delay ${arrival.delay}s`} />
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
      <List innerDivStyle={{ height: this.state.height }}>
        {this.createArrivalsList()}
      </List>
    </div>);
  }
}

export default StopArrivalTimes;
