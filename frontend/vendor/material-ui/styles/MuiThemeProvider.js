import {Component, PropTypes} from 'react';
import getMuiTheme from './getMuiTheme';

class MuiThemeProvider extends Component {

  getChildContext() {
    return {
      muiTheme: this.props.muiTheme || getMuiTheme(),
    };
  }

  render() {
    return this.props.children;
  }
}

MuiThemeProvider.propTypes = {
  children: PropTypes.element,
  muiTheme: PropTypes.object,
};

MuiThemeProvider.childContextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default MuiThemeProvider;
