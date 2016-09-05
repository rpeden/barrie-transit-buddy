import { createStore, combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import transitApp from "./reducers.js";

const reducers = combineReducers({
  app: transitApp,
  routing: routerReducer
});

const store = createStore(reducers);

export default store;
