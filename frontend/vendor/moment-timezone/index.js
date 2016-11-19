/*var moment = module.exports = require("./moment-timezone");
moment.tz.load(require('./data/packed/latest.json'));*/

import moment from "./moment-timezone";
moment.tz.load(require('./data/packed/latest.json'));
export default moment;
