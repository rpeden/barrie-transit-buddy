import "whatwg-fetch";
import React from "react";
import ReactDOM from "react-dom";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TransitMap from "./TransitMap.js";
import RouteSelector from "./RouteSelector.js";
import StopSelector from "./StopSelector.js";
import StopArrivalTimes from "./StopArrivalTimes.js";
import AppHeader from "./AppHeader.jsx";
import { Router, Route, hashHistory } from "react-router";
import { Provider } from "react-redux";
import store from "./store/store.js";

import injectTapEventPlugin from "react-tap-event-plugin";
import theme from "./utils/Theme.js";

injectTapEventPlugin();

const Container = () => {
  const style = {
    display: "flex"
  };
  return (
    <Provider store={store}>
        <div>
          <div style={style}>
            <div style={{display: "flex", flexDirection: "column", width: "300px"}}>
            <AppHeader title="Barrie Transit Buddy"/>
            <Router history={hashHistory}>
              <Route path="/" component={RouteSelector} />
              <Route path="/arrivals/:routeId/:stopId" component={StopArrivalTimes} />
              <Route path="/stops/:routeId/:routeName" component={StopSelector} />
            </Router>
            </div>
            <TransitMap />
          </div>
        </div>
    </Provider>
  );
};

const App = () => (
    <MuiThemeProvider muiTheme={theme}>
        <Container />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById("app"));
