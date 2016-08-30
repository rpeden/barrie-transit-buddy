import {default as React, PropTypes} from "react";
import AppBar from "material-ui/AppBar";


export default function appHeader(props) {
  return (
            <div>
                <AppBar iconElementLeft={<span />} title={props.title} />
            </div>
        );
}

appHeader.propTypes = {
    PropTypes.string.isRequired
}
