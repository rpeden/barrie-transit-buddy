import { Component } from 'react';
import _ from 'lodash';

class HeightResizingComponent extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleResize = _.throttle(::this.handleResize, 500);
  }
  handleResize(e) {
    this.setState({height: window.innerHeight - 64 + "px"});
  }

  componentDidMount() {
    window.addEventListener('resize', ::this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ::this.handleResize);
  }
}

export default HeightResizingComponent;
