import * as React from 'react';
import {List, ListItem} from 'material-ui/List';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import { hashHistory } from 'react-router';
import { toTitleCase } from './utils/StringUtils.js';
import { connect } from 'react-redux'
import { fetchStops, fetchRouteShapes, clearShapes } from './store/ActionCreators';


class RouteSelector extends HeightResizingComponent {

  constructor(props, context) {
    super(props, context);

    this.state = {
      height: window.innerHeight - 64 + "px"
    }
  }

  createRoutes() {
      let onRouteEnter = function(routeId) {
          this.props.onRouteEnter(routeId);
      }.bind(this);

      let routes = this.props.routes.map((el) => {
        const text = `${el.route_short_name} ${toTitleCase(el.route_long_name)}`;
        const handler = () => this.props.onRouteClick(el.route_id, text);

        return <ListItem value={{routeId: el.route_id, name: text}}
                         key={el.id}
                         primaryText={text}
                         onMouseEnter={() => { onRouteEnter(el.shape_id) }}
                         onClick={handler}/>
      });
      return routes;
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
                    {this.createRoutes()}
                  </List>
              </div>
          </div>);
  }
}

const mapStateToProps = (state) => {
    return {
        routes: state.routes
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      onRouteClick: (routeId, stopName) => {
        let fetchAction = fetchStops(routeId);
        dispatch(fetchAction)
        setTimeout(() => {
          hashHistory.push("/stops/" + routeId
                                     + "/"
                                     + encodeURIComponent(stopName));
        }, 350);
      },
      onRouteEnter: (routeId) => {
          let fetchShapesAction = fetchRouteShapes(routeId);
          dispatch(fetchShapesAction);
      },
      onRouteLeave: (routeId) => {
          let clearShapesAction = clearShapes(routeId);
          displatch(clearShapesAction);
      }
    }
}

const Selector = connect(mapStateToProps,mapDispatchToProps)(RouteSelector);

export default Selector;
