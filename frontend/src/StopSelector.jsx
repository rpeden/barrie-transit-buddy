import { Component } from 'react';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {List, ListItem} from 'material-ui/List';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import MenuItem from 'material-ui/MenuItem';
import HeightResizingComponent  from './HeightResizingComponent.jsx';
import { headerStyle } from './Styles.js';
import { hashHistory } from 'react-router';
import $ from 'jquery';
import _ from 'lodash';


class StopSelector extends HeightResizingComponent {

  constructor(props) {
    super(props);
    this.state = {
      stops: [],
      height: window.innerHeight - 64 + "px"
    };
    this.stopUrl = "/routes/" + this.props.params.routeId + "/stops";
  }

  componentDidMount() {
    this.serverRequest = $.get(this.stopUrl, function (result) {
      const stops = JSON.parse(result);
      this.setState({
        stops: stops || []
      });
    }.bind(this));
  }

  componentWillUnmount() {
    if(this.serverRequest) {
      this.serverRequest.abort();
    }
  }

  createStopList() {
    const handler = this.onStopClick;
    const routeId = this.props.params.routeId;
    return this.state.stops.map((stop) => {
      return <ListItem key={stop.stop_id}
                       primaryText={`${stop.stop_id}  -  ${stop.stop_name}`}
                       onClick={() => { ::this.onStopClick(stop.stop_id) }} />
    });
  }

  onStopClick(stopId) {
      const routeId = this.props.params.routeId;
      setTimeout(() => {
          hashHistory.push(`/arrivals/${routeId}/${stopId}`)
      }, 350)
  }

  onBackClick() {
    setTimeout(() => {
      hashHistory.goBack();
    }, 350);
  }

  render() {
    const divStyle = {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      width: '300px',
      height: this.state.height,
      boxShadow: '5px 0px 11px -7px rgba(0,0,0,0.50)',
      zIndex: 10,
      backgroundColor: 'white',
      color: 'black',
    }

    return (
    <div style={divStyle}>
      <div>
        <Toolbar style={{justifyContent:'auto'}}>
          <ToolbarGroup firstChild={true}>
            <IconButton onClick={::this.onBackClick} style={{marginTop:'5px'}}>
              <NavigationArrowBack />
            </IconButton>
          </ToolbarGroup>
          <ToolbarGroup lastChild={true} style={{alignSelf: 'center'}}>
            <ToolbarTitle style={{color: 'rgba(0,0,0,0.65)'}} text={this.props.params.routeName} />
          </ToolbarGroup>
        </Toolbar>
      </div>
      <div style={{flexGrow: 1, overflow: 'auto'}}>
      <List>
        {this.createStopList()}
      </List>
      </div>
    </div>);
  }
}

export default StopSelector;
