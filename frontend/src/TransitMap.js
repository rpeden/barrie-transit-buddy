import { Component, PropTypes } from "react";
import React from "react";
import { GoogleMapLoader, GoogleMap, Polyline } from "react-google-maps";
import _ from "lodash";
import { connect } from "react-redux";
import { Dimensions, Times } from "./utils/Constants";

class TransitMap extends Component {
  state = {
    width: `${window.innerWidth - Dimensions.SIDE_BAR_WIDTH_PX}px`,
    height: `${window.innerHeight}px`
  }

  static propTypes = {
    shapes: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.handleWindowResize = _.throttle(::this.handleWindowResize, Times.RESIZE_THROTTLE_MS);
  }

  componentWillMount() {
    this.handleWindowResize();
  }
  componentDidMount() {
    window.addEventListener("resize", ::this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", ::this.handleWindowResize);
  }

  handleWindowResize() {
    this.setState({
      width: `${window.innerWidth - Dimensions.SIDE_BAR_WIDTH_PX}px`,
      height: `${window.innerHeight}px`
    });
  }

  render() {
    return (
      <GoogleMapLoader
        containerElement={
          <div

            style={{
              height: this.state.height,
              width: this.state.width
            }}
          /> }
        googleMapElement={
          <GoogleMap
            ref={(map) => (this._googleMapComponent = map) /*&& console.log(map.getZoom())*/}
            defaultZoom={13}
            defaultCenter={{ lat: 44.389, lng: -79.688 }}
            onClick={() => {}}
          >
            <Polyline path={this.props.shapes}
              options={{geodesic: true, strokeColor: "#3366ff",
                        strokeOpacity: 0.7, strokeWeight: 4}}
            />
          </GoogleMap>
        }
      />
    );
  }
}

TransitMap.propTypes = {
  shapes: PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return {
    shapes: state.shapes
  };
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {
  };
};

const Map = connect(mapStateToProps, mapDispatchToProps)(TransitMap);

export default Map;
