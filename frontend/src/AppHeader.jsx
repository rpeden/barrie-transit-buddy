import * as React from 'react';
import AppBar from 'material-ui/AppBar';

/**
 *
 * @param props Object
 * @returns {ReactElement}
 */
export default function(props) {
        return (
            <div>
                <AppBar iconElementLeft={<span></span>} title={props.title} />
            </div>
        );
}