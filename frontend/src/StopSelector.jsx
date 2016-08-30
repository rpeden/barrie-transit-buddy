import React from "react";
import {List, ListItem} from "material-ui/List";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import HeightResizingComponent from "./HeightResizingComponent.jsx";
import { hashHistory } from "react-router";
import { connect } from "react-redux";
import { fetchArrivalTimes } from "./store/ActionCreators";


class StopSelector extends HeightResizingComponent {

  constructor(props) {
    super(props);
    this.state = {
      stops: [],
      height: window.innerHeight - 64 + "px"
    };
  }

  createStopList() {
    const routeId = this.props.params.routeId;
    return this.props.stops.map((stop) => {
      return (<ListItem key={stop.stop_id}
        primaryText={`${stop.stop_id}  -  ${stop.stop_name}`}
        onClick={() => { this.props.onStopClick(routeId, stop.stop_id); }}
              />);
    });
  }

  onStopClick(stopId) {
    const routeId = this.props.params.routeId;
    setTimeout(() => {
      hashHistory.push(`/arrivals/${routeId}/${stopId}`);
    }, 350);
  }

  onBackClick() {
    setTimeout(() => {
      hashHistory.goBack();
    }, 350);
  }

  render() {
    const divStyle = {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      width: "300px",
      height: this.state.height,
      boxShadow: "5px 0px 11px -7px rgba(0,0,0,0.50)",
      zIndex: 10,
      backgroundColor: "white",
      color: "black"
    };

    return (
    <div style={divStyle}>
      <div>
        <Toolbar style={{justifyContent: "auto"}}>
          <ToolbarGroup firstChild>
            <IconButton onClick={::this.onBackClick} style={{marginTop: "5px"}}>
              <NavigationArrowBack />
            </IconButton>
          </ToolbarGroup>
          <ToolbarGroup lastChild style={{alignSelf: "center"}}>
            <ToolbarTitle style={{color: "rgba(0,0,0,0.65)"}} text={this.props.params.routeName} />
          </ToolbarGroup>
        </Toolbar>
      </div>
      <div style={{flexGrow: 1, overflow: "auto"}}>
      <List>
        {this.createStopList()}
      </List>
      </div>
    </div>);
  }
}

const mapStateToProps = (state) => {
  return {
    stops: state.stops
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onStopClick: (routeId, stopId) => {
      dispatch(fetchArrivalTimes(routeId, stopId));
      setTimeout(() => {
        hashHistory.push(`/arrivals/${routeId}/${stopId}`);
      }, 350);
    }
  };
};

const Selector = connect(mapStateToProps, mapDispatchToProps)(StopSelector);

export default Selector;
