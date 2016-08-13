import { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

class Something extends Component {
    render() {
        const style = {
            margin: 12
        }
        const something = "hahaha";
        const ok = "";
        return (
            <div>
                <RaisedButton label='Click Me' primary={true} style={style}/>
            </div>);
    }
}

const App = () => (
    <MuiThemeProvider>
        <Something />
    </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('app'));

console.log(hello);
