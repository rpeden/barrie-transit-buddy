import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import injectTapEventPlugin from 'react-tap-event-plugin';
import _ from 'lodash';

injectTapEventPlugin();

function Abc(something) {

}

class HeightResizingComponent extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleResize = _.throttle(::this.handleResize, 500);
  }
  handleResize(e) {
    this.setState({height: window.innerHeight - 64 + "px"});
  }

  componentDidMount() {
    window.addEventListener('resize', ::this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ::this.handleResize);
  }
}

class TransitMap extends Component {
  state = {
    markers: [{
      position: {
        lat: 25.0112183,
        lng: 121.52067570000001,
      },
      key: `Taiwan`,
      defaultAnimation: 2,
    }],
  }

  constructor(props, context) {
    super(props, context);
    this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
  }

  componentDidMount() {
    window.addEventListener(`resize`, this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this.handleWindowResize);
  }

  handleWindowResize() {
    console.log(`handleWindowResize`, this._googleMapComponent);
    triggerEvent(this._googleMapComponent, `resize`);
  }

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick(event) {
    let { markers } = this.state;
    markers = update(markers, {
      $push: [
        {
          position: event.latLng,
          defaultAnimation: 2,
          key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
        },
      ],
    });
    this.setState({ markers });

    if (markers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }
  }

  handleMarkerRightclick(index, event) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    let { markers } = this.state;
    markers = update(markers, {
      $splice: [
        [index, 1],
      ],
    });
    this.setState({ markers });
  }

  render() {
    return (
      <GoogleMapLoader
        containerElement={
          <div
            {...this.props}
            style={{
              height: `100%`,
              width: '500px'
            }}
          /> }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={3}
            defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
            onClick={::this.handleMapClick}
          >
            {this.state.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                  onRightclick={this.handleMarkerRightclick.bind(this, index)}
                />
              );
            })}
          </GoogleMap>
        }
      />
    );
  }
}
@Abc
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
        <div style={{height: "500px", width:"500px"}}>
          <TransitMap />
        </div>
      </div>
    </div>
  )
}

const App = () => (
    <MuiThemeProvider>
        <Container />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));
