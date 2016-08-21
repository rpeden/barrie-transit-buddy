import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TransitMap from './TransitMap.jsx';
import RouteSelector from './RouteSelector.jsx';
import StopSelector from './StopSelector.jsx';
import StopArrivalTimes from './StopArrivalTimes.jsx';
import { Router, Route, hashHistory } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin';
import eventBus from './EventBus.js'
import theme from './utils/Theme.js'

injectTapEventPlugin();

class Header extends Component {
  render() {
    return (
      <div>
        <AppBar iconElementLeft={<span></span>} title="Barrie Transit Buddy" />
      </div>
    );
  }
}

const Container = () => {
  var style = {
    display: 'flex'
  }
  return (
    <div>

      <div style={style}>
        <div style={{display: 'flex', flexDirection: 'column', width: '300px'}}>
        <Header/>
        <Router history={hashHistory}>
          <Route path="/" component={RouteSelector} />
          <Route path="/arrivals/:routeId/:stopId" component={StopArrivalTimes} />
          <Route path="/stops/:routeId/:routeName" component={StopSelector} />
        </Router>
        </div>
        <TransitMap />
      </div>
    </div>
  )
}

const App = () => (
    <MuiThemeProvider muiTheme={theme}>
        <Container />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));
