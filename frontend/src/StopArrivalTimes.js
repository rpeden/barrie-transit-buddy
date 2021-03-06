import React from "react";
import {Table, TableBody, TableHeader
        , TableHeaderColumn, TableRow, TableRowColumn } from "../vendor/material-ui/Table";
import HeightResizingComponent from "./HeightResizingComponent.jsx";
import {Toolbar, ToolbarGroup} from "../vendor/material-ui/Toolbar";
import IconButton from "../vendor/material-ui/IconButton";
import NavigationArrowBack from "../vendor/material-ui/svg-icons/navigation/arrow-back";
import isEmpty from "lodash.isempty";
import head from "lodash.head";
import mean from "lodash.mean";
import { hashHistory } from "react-router";
import { toMinutesFromNow, timeToLocalDate, pluralize } from "./utils/StringUtils";
import * as creators from "./store/ActionCreators";
import { connect } from "react-redux";
import { Dimensions, Times } from "./utils/Constants";


class StopArrivalTimes extends HeightResizingComponent {

  constructor(props) {
    super(props);

    this.state = {
      stopNumber: this.props.params.stopId,
      routeId: this.props.params.routeId,
      trips: [],
      arrivals: [],
      height: `${window.innerHeight - Dimensions.APP_BAR_HEIGHT_PX}px`
    };

    const routeId = this.props.params.routeId;
    const stopId = this.props.params.stopId;
    this.arrivalsUrl = (`/routes/${routeId}/stops/${stopId}/trips`);

    this.props.subscribeToStop(this.props.params.stopId, undefined);
    if (this.props.arrivals && !isEmpty(this.props.arrivals)) {
      const nextTripId = head(this.props.arrivals).tripId;
      this.props.subscribeToTripLocation(nextTripId);
      this.props.subscribeToStop(this.props.params.stopId, nextTripId);
    }
  }

  getState() {
    return this.state;
  }

  componentWillUnmount() {
    this.props.unsubscribeFromStop(this.props.params.stopId);

    if (this.props.arrivals && !isEmpty(this.props.arrivals)) {
      const nextTripId = head(this.props.arrivals).tripId;
      this.props.unsubscribeFromTripLocation(nextTripId);
    }

    this.props.clearStops();
    this.props.clearBusLocation();
  }

  updateArrivalTimes(trips) {
    const updatedTrips = trips.map((trip) => {
      const updatedTime = toMinutesFromNow(timeToLocalDate(trip.scheduledString));
      return Object.assign(trip, { departureTime: updatedTime });
    });
    return updatedTrips;
  }

  createArrivalsList() {
    return this.props.arrivals.map((trip) => {
      let text = "Scheduled";

      const allowableDelaySeconds = 29;
      if (trip.delays) {
        const bufferedDelay = mean(trip.delays);
        const onTime = (bufferedDelay >= -(allowableDelaySeconds)) &&
                       (bufferedDelay <= allowableDelaySeconds);
        const early = bufferedDelay < -(allowableDelaySeconds);

        if (onTime) {
          text = "On Time";
        } else if (early) {
          const delay = Math.round(bufferedDelay / Times.SECONDS_PER_MIN);
          text = `${-delay} ${pluralize(-(delay), "min", "mins")} early`;
        } else {
          const delay = Math.round(bufferedDelay / Times.SECONDS_PER_MIN);
          text = `${delay} ${pluralize(delay, "min", "mins")} late`;
        }
      }

      const rowStyle = {
        fontSize: "16px"
      };

      const column = (rowText) => <TableRowColumn style={rowStyle}>{rowText}</TableRowColumn>;

      return (
                <TableRow key={trip.tripId}>
                    {column(trip.departureTime)}
                    {column(text)}
                </TableRow>
        );
    });
  }

  onBackClick() {
    setTimeout(() => {
      hashHistory.goBack();
    }, Times.NAVIGATION_DELAY_MS);
  }

  render() {
    const divStyle = {
      width: "300px",
      height: this.state.height,
      maxHeight: this.state.height,
      boxShadow: "5px 0px 11px -7px rgba(0,0,0,0.50)",
      zIndex: 10,
      backgroundColor: "white",
      color: "black",
      overflow: "auto"
    };

    const tableHeaderStyle = {
      fontSize: "19px"
    };

    const headerColorStyle = {
      color: "rgba(0,0,0,0.65)"
    };

    const routeStyle = Object.assign({}, headerColorStyle, { fontSize: "20px" });
    const stopStyle = Object.assign({}, headerColorStyle,
                                     { fontSize: "16px", marginTop: "5px" });

    return (
        <div style={divStyle}>
            <Toolbar style={{justifyContent: "auto"}}>
              <ToolbarGroup firstChild>
                <IconButton onClick={this.onBackClick.bind(this)} style={{marginTop: "5px"}}>
                  <NavigationArrowBack />
                </IconButton>
              </ToolbarGroup>
              <ToolbarGroup lastChild style={{alignSelf: "center"}}>
                <div>
                    <div style={routeStyle}>{`Route ${this.props.params.routeId}`}</div>
                    <div style={stopStyle}>{`Stop ${this.props.params.stopId}`}</div>
                </div>
              </ToolbarGroup>
            </Toolbar>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={tableHeaderStyle}>
                    Arriving In
                </TableHeaderColumn>
                <TableHeaderColumn style={tableHeaderStyle}>
                    Status
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
                {this.createArrivalsList()}
            </TableBody>
          </Table>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    arrivals: state.app.arrivals,
    selectedStop: state.app.selectedStop
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStop: (stopId) => {
      dispatch(creators.subscribeToStop(stopId));
    },
    subscribeToTripLocation: (tripId) => {
      dispatch(creators.subscribeTripLocation(tripId));
    },
    unsubscribeFromStop: (stopId) => {
      dispatch(creators.unsubscribeFromStop((stopId)));
    },
    unsubscribeFromTripLocation: (tripId) => {
      dispatch(creators.unsubscribeTripLocation(tripId));
    },
    clearStops: () => {
      dispatch(creators.clearStops());
    },
    clearBusLocation: () => {
      dispatch(creators.clearBusLocation());
    },
    removeNextArrival: () => {
      dispatch(creators.removeNextArrival());
    }
  };
};

const ArrivalTimes = connect(mapStateToProps, mapDispatchToProps)(StopArrivalTimes);

export default ArrivalTimes;
