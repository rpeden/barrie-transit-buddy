import { Component } from "react";
import { Dimensions } from "./utils/Constants";
import _ from "lodash";

class HeightResizingComponent extends Component {

  constructor(props, context) {
    super(props, context);

    const throttleDurationMillis = 500;
    this.handleResize = _.throttle(::this.handleResize, throttleDurationMillis);
  }

  handleResize() {
    this.setState({height: `${window.innerHeight - Dimensions.APP_BAR_HEIGHT_PX} + px`,
                   maxHeight: `${window.innerHeight - Dimensions.APP_BAR_HEIGHT_PX} + px`});
  }

  componentDidMount() {
    window.addEventListener("resize", ::this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", ::this.handleResize);
  }
}

export default HeightResizingComponent;
