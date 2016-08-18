import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import {browserHistory, refresh } from 'react-router';


class RouteSelector extends HeightResizingComponent {

  constructor(props, context) {
    super(props, context);

    let routes = window.routes.map((el) => {
      let text = `${el.route_short_name} ${el.route_long_name}`;
      return <MenuItem value={text} routeId={el.route_id} key={el.id} primaryText={text} />
    });

    this.state = {
      routes: routes,
      selectedRoute: routes[0].props.primaryText,
      height: window.innerHeight - 64 + "px"
    }
  }

  onFindClick() {
    browserHistory.push("/transit/#/stops");
    refresh();
  }

  render() {
      const divStyle = {
        width: '300px',
        height: this.state.height,
        boxShadow: '5px 0px 11px -7px rgba(0,0,0,0.50)',
        zIndex: 10,
        backgroundColor: 'white',
        color: 'black',
      }
      const buttonContainerStyle = {
        width: '90%',
        textAlign: 'right',
        marginTop: '45px'
      }
      const routeSelectionStyle = {
        width: '85%',
        marginLeft: 'auto',
        marginRight: 'auto'
      }

      return (
          <div style={divStyle}>
            <h3 style={{width:'100%', textAlign: 'center', marginTop:'40px'}}>Select a route</h3>
            <div style={routeSelectionStyle}>
              <SelectField value={this.state.selectedRoute}>{this.state.routes}</SelectField>
            </div>
            <div style={buttonContainerStyle}>
              <RaisedButton onClick={::this.onFindClick} label='Find Stops' primary={true} />
            </div>
          </div>);
  }
}

exports.RouteSelector = RouteSelector;
export default RouteSelector;
