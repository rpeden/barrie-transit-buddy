import { Component } from "react";
import { Dimensions, Times } from "./utils/Constants";
import throttle from "lodash.throttle";

class HeightResizingComponent extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleResize = throttle(this.handleResize, Times.RESIZE_THROTTLE_MS);
  }

  handleResize() {
    this.setState({height: `${window.innerHeight - Dimensions.APP_BAR_HEIGHT_PX}px`,
                   maxHeight: `${window.innerHeight - Dimensions.APP_BAR_HEIGHT_PX}px`});
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize.bind(this));
  }
}

export default HeightResizingComponent;
