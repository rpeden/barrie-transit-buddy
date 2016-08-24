import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TransitMap from './TransitMap.jsx';
import RouteSelector from './RouteSelector.jsx';
import StopSelector from './StopSelector.jsx';
import StopArrivalTimes from './StopArrivalTimes.jsx';
import AppHeader from './AppHeader.jsx';
import { Router, Route, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import store from './store/store.js'

import injectTapEventPlugin from 'react-tap-event-plugin';
import theme from './utils/Theme.js'

injectTapEventPlugin();

const Container = () => {
  var style = {
    display: 'flex'
  }
  return (
    <Provider store={store}>
        <div>
          <div style={style}>
            <div style={{display: 'flex', flexDirection: 'column', width: '300px'}}>
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
  )
}

const App = () => (
    <MuiThemeProvider muiTheme={theme}>
        <Container />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));
