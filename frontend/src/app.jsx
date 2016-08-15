import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TransitMap from './TransitMap.jsx';
import RouteSelector from './RouteSelector.jsx';

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
      <Header />
      <div style={style}>
        <RouteSelector />
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
