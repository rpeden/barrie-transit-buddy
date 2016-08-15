import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';


class RouteSelector extends HeightResizingComponent {

  constructor(props, context) {
    super(props, context);

    let routes = window.routes.map((el) => {
      let text = `${el.route_short_name} ${el.route_long_name}`;
      return <MenuItem value={text} key={el.id} primaryText={text} />
    });

    this.state = {
      routes: routes,
      selectedRoute: routes[0].props.primaryText,
      height: window.innerHeight - 64 + "px"
    }
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
              <RaisedButton label='Find Stops' primary={true} />
            </div>
          </div>);
  }
}

exports.RouteSelector = RouteSelector;
export default RouteSelector;
