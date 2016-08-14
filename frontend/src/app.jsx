import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TransitMap from './TransitMap.jsx';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { indigo500,indigo700 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import _ from 'lodash';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: indigo500,
    primary2Color: indigo700,
  },
});

class RouteChooser extends HeightResizingComponent {

  constructor(props, context) {
    super(props, context);
    let routes = [
      "101 - Georgian Drive",
      "151 - College",
      "207 - Mapleview",
      "151 - Nowhere"
    ];
    this.state = {
      routes: routes,
      selectedRoute: routes[0],
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
      var routeItems = this.state.routes.map((item) => {
        return <MenuItem value={item} key={item} primaryText={item} />;
      });

      return (
          <div style={divStyle}>
            <h3 style={{width:'100%', textAlign: 'center', marginTop:'40px'}}>Select a route</h3>
            <div style={routeSelectionStyle}>
              <SelectField value={this.state.selectedRoute}>{routeItems}</SelectField>
            </div>
            <div style={buttonContainerStyle}>
              <RaisedButton label='Find Stops' primary={true} />
            </div>
          </div>);
  }
}

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
        <RouteChooser />
        <TransitMap />
      </div>
    </div>
  )
}

const App = () => (
    <MuiThemeProvider muiTheme={muiTheme}>
        <Container />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));
