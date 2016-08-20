import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import { hashHistory, refresh } from 'react-router';
import { headerStyle } from './Styles.js';
import { toTitleCase } from './utils/StringUtils.js';


class RouteSelector extends HeightResizingComponent {

  constructor(props, context) {
    super(props, context);

    let routes = window.routes.map((el) => {
      let text = `${el.route_short_name} ${toTitleCase(el.route_long_name)}`;
      return <MenuItem value={{routeId: el.route_id, name: text}} key={el.id} primaryText={text} />
    });

    this.state = {
      routes: routes,
      selectedRoute: routes[0].props.value,
      height: window.innerHeight - 64 + "px"
    }
  }

  onRouteSelect(event, index, value) {
      this.setState({selectedRoute: value});
  }

  onFindClick() {
    setTimeout(() => {
      let selected = this.state.selectedRoute;
      hashHistory.push("/stops/" + selected.routeId
                                 + "/"
                                 + encodeURIComponent(selected.name));
    }, 350);

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
            <h3 style={headerStyle}>Select a route</h3>
            <div style={routeSelectionStyle}>
              <SelectField onChange={::this.onRouteSelect} value={this.state.selectedRoute}>{this.state.routes}</SelectField>
            </div>
            <div style={buttonContainerStyle}>
              <RaisedButton  onClick={::this.onFindClick} label='Find Stops' primary={true} />
            </div>
          </div>);
  }
}

exports.RouteSelector = RouteSelector;
export default RouteSelector;
