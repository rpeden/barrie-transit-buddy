import {default as React, PropTypes} from "react";
import AppBar from "../vendor/material-ui/AppBar";


export default function appHeader(props) {
  return (
            <div>
                <AppBar iconElementLeft={<span />} title={props.title} />
            </div>
        );
}

appHeader.propTypes = {
  title: PropTypes.string.isRequired
};
