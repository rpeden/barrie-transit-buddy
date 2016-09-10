import { createStore, combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import transitApp from "./reducers.js";

const reducers = combineReducers({
  app: transitApp,
  routing: routerReducer
});

const store = createStore(reducers, window.devToolsExtension && window.devToolsExtension());
window.store = store;
export default store;
