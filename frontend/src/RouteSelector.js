import React from "react";
import {List, ListItem} from "../vendor/material-ui/List";
import HeightResizingComponent from "./HeightResizingComponent.jsx";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "../vendor/material-ui/Toolbar";
import { hashHistory } from "react-router";
import { toTitleCase } from "./utils/StringUtils.js";
import { connect } from "react-redux";
import { fetchStops, fetchRouteShapes, clearShapes, clearStops } from "./store/ActionCreators";
import { Dimensions, Times } from "./utils/Constants";


class RouteSelector extends HeightResizingComponent {

  constructor(props, context) {
    super(props, context);

    this.state = {
      height: `${window.innerHeight - Dimensions.APP_BAR_HEIGHT_PX}px`
    };
  }

  componentWillMount() {
    this.props.clearStops();
  }

  createRoutes() {
    const onRouteEnter = function (routeId) {
      this.props.onRouteEnter(routeId);
    }.bind(this);

    const routes = this.props.routes.map((el) => {
      const text = `${el.route_short_name} ${toTitleCase(el.route_long_name)}`;
      const handler = () => this.props.onRouteClick(el.route_id, text);

      return (
        <ListItem value={{routeId: el.route_id, name: text}}
          key={el.id}
          primaryText={text}
          onMouseEnter={() => { onRouteEnter(el.shape_id); }}
          onClick={handler}
        />);
    });
    return routes;
  }

  render() {
    const divStyle = {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      width: "300px",
      height: this.state.height,
      boxShadow: "5px 0px 11px -7px rgba(0,0,0,0.50)",
      zIndex: 10,
      backgroundColor: "white",
      color: "black"
    };

    return (
          <div style={divStyle}>
              <Toolbar style={{justifyContent: "auto"}}>
                <ToolbarGroup lastChild style={{alignSelf: "center"}}>
                    <ToolbarTitle style={{color: "rgba(0,0,0,0.65)"}} text="Select a Route" />
                </ToolbarGroup>
              </Toolbar>
              <div style={{flexGrow: 1, overflow: "auto"}}>
                  <List>
                    {this.createRoutes()}
                  </List>
              </div>
          </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    routes: state.app.routes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRouteClick: (routeId, stopName) => {
      const fetchAction = fetchStops(routeId);
      dispatch(fetchAction);

      const encodedStop = encodeURIComponent(stopName);
      const navUrl = `/stops/${routeId}/${encodedStop}`;
      setTimeout(() => {
        hashHistory.push(navUrl);
      }, Times.NAVIGATION_DELAY_MS);
    },
    onRouteEnter: (routeId) => {
      const fetchShapesAction = fetchRouteShapes(routeId);
      dispatch(fetchShapesAction);
    },
    onRouteLeave: (routeId) => {
      const clearShapesAction = clearShapes(routeId);
      dispatch(clearShapesAction);
    },
    clearStops: () => {
      dispatch(clearStops());
    }
  };
};

const Selector = connect(mapStateToProps, mapDispatchToProps)(RouteSelector);

export default Selector;
