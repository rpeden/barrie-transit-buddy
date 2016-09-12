import { Component, PropTypes } from "react";
import React from "react";
import { GoogleMapLoader, GoogleMap, Polyline, Marker } from "react-google-maps";
import _ from "lodash";
import { connect } from "react-redux";
import { hashHistory } from "react-router";
import { Dimensions, Times } from "./utils/Constants";
import { fetchArrivalTimes, updateSelectedStop,
  updateHighlightedStop, clearHighlightedStop } from "./store/ActionCreators";


class TransitMap extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleWindowResize = _.throttle(this.handleWindowResize, Times.RESIZE_THROTTLE_MS);

    this.state = {
      width: `${window.innerWidth - Dimensions.SIDE_BAR_WIDTH_PX}px`,
      height: `${window.innerHeight}px`
    };

    window.updateMap = this.updateMapBoundaries.bind(this);
    window.resetMap = this.resetMap.bind(this);

    this.state = {
      // eslint-disable-next-line
      markers: {}
    };
  }

  componentWillMount() {
    this.handleWindowResize();
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.stops !== nextProps.stops) {
      this.clearMarkers();
      this.drawStopMarkers(nextProps.stops);
    }

    if (this.props.highlightedStop !== nextProps.highlightedStop) {
      //not needed if there was no previously highlighted stop
      if (this.props.highlightedStop) {
        const markerInfo = this.state.markers[this.props.highlightedStop.stop_id];
        if (markerInfo) {
          markerInfo.marker.setIcon(null);
          markerInfo.marker.setZIndex(markerInfo.zIndex);
        }
      }
    }

    if (nextProps.highlightedStop) {
      const markerInfo = this.state.markers[nextProps.highlightedStop.stop_id];
      if (markerInfo) {
        markerInfo.marker.setIcon("/img/marker-blue-small.png");
        // eslint-disable-next-line
        markerInfo.marker.setZIndex(1000);
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.stops !== nextProps.stops ||
           this.props.shapes !== nextProps.shapes ||
           this.state.stopNameToShow !== nextState.stopNameToShow;
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize(this));
  }

  handleWindowResize() {
    this.setState({
      width: `${window.innerWidth - Dimensions.SIDE_BAR_WIDTH_PX}px`,
      height: `${window.innerHeight}px`
    });
  }

  onStopMarkerClick(stop) {
    this.props.onStopClick(this.props.selectedRoute, stop);
  }

  onStopMarkerHover(stop) {
    // eslint-disable-next-line
    //console.log("stop: " + stop.stop_name);
    this.setState({ stopNameToShow: stop.stop_name });
    this.props.updateHighlightedStop(stop);
  }

  onStopMarkerExit() {
    this.setState({ stopNameToShow: "" });
    this.props.clearHighlightedStop();
  }

  clearMarkers() {
    // eslint-disable-next-line
    for (const stopId of Object.keys(this.state.markers)) {
      const marker = this.state.markers[stopId].marker;
      marker.setMap(null);
      delete this.state.markers[stopId];
    }
  }

  renderStopName() {
    if (this.state.stopNameToShow) {
      return (
        <div style={{ position: "fixed",
                      fontSize: "18px",
                      borderRadius: "5px",
                      top: "20px",
                      right: "20px",
                      padding: "10px",
                      backgroundColor: "rgba(0,0,0,0.75)",
                      color: "#fff",
                      zIndex: 50 }}>
          {this.state.stopNameToShow}
        </div>
      );
    } else {
      return <span />;
    }
  }

  updateMapBoundaries() {
    const bounds = new google.maps.LatLngBounds();
    this.props.shapes.forEach((shape) => {
      bounds.extend(shape);
    });
    this._googleMapComponent.fitBounds(bounds);
  }

  resetMap() {
    /* eslint-disable no-magic-numbers */
    const swPoint = new google.maps.LatLng(44.319172, -79.734391);
    const nePoint = new google.maps.LatLng(44.422340, -79.610429);
    /* eslint-enable no-magic-numbers */
    const bounds = new google.maps.LatLngBounds(swPoint, nePoint);

    this._googleMapComponent.fitBounds(bounds);
  }

  drawStopMarkers(newStops) {
    newStops.map((stop, idx) => {
      const lat = stop.stop_lat;
      const lng = stop.stop_lon;
      const markerOptions = {
        cursor: "pointer",
        position: new google.maps.LatLng(lat, lng),
        zIndex: idx,
        map: this._googleMapComponent.getMap()
      };
      const marker = new google.maps.Marker(markerOptions);
      google.maps.event.addListener(marker, "click",
                                    this.onStopMarkerClick.bind(this, stop));
      google.maps.event.addListener(marker, "mouseover",
                                    this.onStopMarkerHover.bind(this, stop));
      google.maps.event.addListener(marker, "mouseout",
                                    this.onStopMarkerExit.bind(this, stop));
      //eslint-disable-next-line
      this.state.markers[stop.stop_id] = {
        marker,
        zIndex: idx
      };
    });
  }

  displayStops() {
    return this.props.stops.map((stop, idx) => {
      const zIndex = idx;
      let rawMarker;
      const marker = (
          <Marker
            key={stop.stop_id}
            ref={(ref) => { rawMarker = ref; }}
            position={{lat: stop.stop_lat, lng: stop.stop_lon}}
            onClick={this.onStopMarkerClick.bind(this, stop)}
            zIndex={zIndex}
            onMouseover={this.onStopMarkerHover.bind(this, stop)}
            onMouseout={this.onStopMarkerExit.bind(this)}
          />);
      //const rawMarker = marker.getState().marker;
      //rawMarker.setState({initialZIndex: zIndex});
      this.state.markers.set(stop.stop_id, { zIndex, marker: rawMarker });
      return marker;
    });
  }

  render() {
    return (
      <GoogleMapLoader
        containerElement={
          <div style={{ height: this.state.height, width: this.state.width }} />}
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) /*&& console.log(map.getZoom())*/}
            defaultZoom={13}
            defaultCenter={{ lat: 44.389, lng: -79.688 }}
            //onClick={() => {}}
          >
            <Polyline path={this.props.shapes}
              options={{geodesic: true, strokeColor: "#3366ff",
                        strokeOpacity: 0.7, strokeWeight: 4}}
            />
            {this.renderStopName()}
          </GoogleMap>
        }
      />
    );
  }
}

TransitMap.propTypes = {
  shapes: PropTypes.array.isRequired,
  stops: PropTypes.array.isRequired,
  onStopClick: PropTypes.func.isRequired,
  selectedRoute: PropTypes.string.isRequired,
  highlightedStop: PropTypes.object,
  updateHighlightedStop: PropTypes.func.isRequired,
  clearHighlightedStop: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    shapes: state.app.shapes,
    stops: state.app.stops,
    selectedRoute: state.app.selectedRoute,
    highlightedStop: state.app.highlightedStop
    //view: state.view
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onStopClick: (routeId, stop) => {
      dispatch(fetchArrivalTimes(routeId, stop.stop_id));
      dispatch(updateSelectedStop(stop));
      setTimeout(() => {
        hashHistory.push(`/arrivals/${routeId}/${stop.stop_id}`);
      }, Times.NAVIGATION_DELAY_MS);
    },
    updateHighlightedStop: (stop) => {
      dispatch(updateHighlightedStop(stop));
    },
    clearHighlightedStop: () => {
      dispatch(clearHighlightedStop());
    }
  };
};

const Map = connect(mapStateToProps, mapDispatchToProps)(TransitMap);

export default Map;
