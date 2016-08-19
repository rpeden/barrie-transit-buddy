import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import $ from 'jquery';
import _ from 'lodash';


class StopSelector extends HeightResizingComponent {

  constructor(props) {
    super(props);
    this.state = {
      stops: [],
      height: window.innerHeight - 64 + "px"
    };
    this.stopUrl = "/routes/1/stops";
  }

  componentDidMount() {
    this.serverRequest = $.get(this.stopUrl, function (result) {
      let stops = JSON.parse(result);
      this.setState({
        stops: stops || []
      });
    }.bind(this));
  }

  componentWillUnmount() {
    if(this.serverRequest) {
      this.serverRequest.abort();
    }
  }

  createStopList() {
    return this.state.stops.map((stop) => {
      return <ListItem primaryText={`${stop.stop_id}  -  ${stop.stop_name}`} />
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
      <h3 style={{width: "100%", textAlign: "center"}}>Stops for Route {this.props.params.routeId}</h3>
      <List innerDivStyle={{ height: this.state.height }}>
        {this.createStopList()}
      </List>
    </div>);
  }
}

export default StopSelector;
