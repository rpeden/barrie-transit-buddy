import * as React from 'react';
import AppBar from 'material-ui/AppBar';

interface HeaderProps {
    title: string
}

export default function(props: HeaderProps) {
        return (
            <div>
                <AppBar iconElementLeft={<span></span>} title={props.title} />
            </div>
        );
}