import { Component } from 'react';
import React from 'react';
import { GoogleMapLoader, GoogleMap, Marker, Polyline } from "react-google-maps";
import _ from 'lodash';

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
    height: window.innerHeight + "px",
    points: [new google.maps.LatLng(44.3403594369073,-79.6803241968155),
             new google.maps.LatLng(44.3407047330346,-79.6801847219467),
             new google.maps.LatLng(44.3410346807673,-79.6801847219467)]
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

            <Polyline path={this.state.points} options={{geodesic:true, strokeColor:'#FF0000', strokeOpacity: 1.0, strokeWeight: 2}}/>
          </GoogleMap>
        }
      />
    );
  }
}

export default TransitMap;
