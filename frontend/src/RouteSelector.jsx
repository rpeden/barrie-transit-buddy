import * as React from 'react';
import {List, ListItem} from 'material-ui/List';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import { hashHistory } from 'react-router';
import { toTitleCase } from './utils/StringUtils.js';


class RouteSelector extends HeightResizingComponent {

  constructor(props, context) {
    super(props, context);

    let routes = window.routes.map((el) => {
      const text = `${el.route_short_name} ${toTitleCase(el.route_long_name)}`;
      const handler = () => this.onRouteClick(el.route_id, text);

      return <ListItem value={{routeId: el.route_id, name: text}}
                       key={el.id}
                       primaryText={text}
                       onClick={handler}/>
    });

    this.state = {
      routes: routes,
      selectedRoute: routes[0].props.value,
      height: window.innerHeight - 64 + "px"
    }
  }

  onRouteClick(routeId, stopName) {
    setTimeout(() => {
      hashHistory.push("/stops/" + routeId
                                 + "/"
                                 + encodeURIComponent(stopName));
    }, 350);
  }

  render() {
      const divStyle = {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
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
        marginRight: 'auto',
        marginTop: '15px'
      }

      return (
          <div style={divStyle}>
              <Toolbar style={{justifyContent:'auto'}}>
                <ToolbarGroup lastChild={true} style={{alignSelf: 'center'}}>
                    <ToolbarTitle style={{color: 'rgba(0,0,0,0.65)'}} text='Select a Route' />
                </ToolbarGroup>
              </Toolbar>
              <div style={{flexGrow: 1, overflow: 'auto'}}>
                  <List>
                    {this.state.routes}
                  </List>
              </div>
          </div>);
  }
}

exports.RouteSelector = RouteSelector;
export default RouteSelector;
