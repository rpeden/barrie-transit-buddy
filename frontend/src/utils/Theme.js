import getMuiTheme from "../../vendor/material-ui/styles/getMuiTheme";
import { indigo500, indigo700 } from "../../vendor/material-ui/styles/colors";

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: indigo500,
    primary2Color: indigo700
  }
});

export default muiTheme;
