import { Component, PropTypes } from "react";
import React from "react";
import { GoogleMapLoader, GoogleMap, Polyline, Marker } from "react-google-maps";
import _ from "lodash";
import { connect } from "react-redux";
import { hashHistory } from "react-router";
import { Dimensions, Times } from "./utils/Constants";
import { fetchArrivalTimes, updateSelectedStop } from "./store/ActionCreators";


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
  }

  componentWillMount() {
    this.handleWindowResize();
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize.bind(this));
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
    this.props.onStopClick(this.props.selectedRoute, stop.stop_id);
  }

  onStopMarkerHover(stop) {
    // eslint-disable-next-line
    console.log("stop: " + stop.stop_name);
    this.setState({ stopNameToShow: stop.stop_name });
  }

  onStopMarkerExit() {
    this.setState({ stopNameToShow: "" });
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
    const swPoint = new google.maps.LatLng(44.317216, -79.751301);
    const nePoint = new google.maps.LatLng(44.431083, -79.607964);
    /* eslint-enable no-magic-numbers */
    const bounds = new google.maps.LatLngBounds(swPoint, nePoint);

    this._googleMapComponent.fitBounds(bounds);
  }

  displayStops() {
    return this.props.stops.map((stop, idx) => {
      let icon;
      let zIndex = idx;
      if (this.props.highlightedStop && this.props.highlightedStop.stop_id === stop.stop_id) {
        icon = "/img/marker-blue-small.png";
        zIndex = 1000;
      }
      return (
        <Marker
          key={stop.stop_id}
          position={{lat: stop.stop_lat, lng: stop.stop_lon}}
          icon={icon}
          onClick={this.onStopMarkerClick.bind(this, stop)}
          zIndex={zIndex}
          onMouseover={this.onStopMarkerHover.bind(this, stop)}
          onMouseout={this.onStopMarkerExit.bind(this)}
        />
      );
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
            {this.displayStops()}
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
  highlightedStop: PropTypes.object
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
    }
  };
};

const Map = connect(mapStateToProps, mapDispatchToProps)(TransitMap);

export default Map;
