import { createStore } from "redux";
import transitApp from "./reducers.js";

const store = createStore(transitApp);

export default store;
