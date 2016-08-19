import { Component } from 'react';
import React from 'react';
import { GoogleMapLoader, GoogleMap, Marker } from "react-google-maps";
import _ from 'lodash';
import eventBus from './EventBus.js'

class TransitMap extends Component {
  state = {
    markers: [{
      position: {
        lat: 44.389,
        lng: -79.688,
      },
      key: `Barrie`,
      defaultAnimation: 2,
    }],
    width: window.innerWidth - 300 + "px",
    height: window.innerHeight + "px"
  }

  constructor(props, context) {
    super(props, context);
    this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
  }

  componentDidMount() {
    window.addEventListener('resize', ::this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ::this.handleWindowResize);
  }

  handleWindowResize() {
    console.log(`handleWindowResize`, this._googleMapComponent);
    this.setState({
      width: window.innerWidth - 300 + "px",
      height: window.innerHeight + "px"
    })
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
              height: this.state.height,
              width: this.state.width
            }}
          /> }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) && console.log(map.getZoom())}
            defaultZoom={13}
            defaultCenter={{ lat: 44.389, lng: -79.688 }}
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

export default TransitMap;
