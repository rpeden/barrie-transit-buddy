import { createStore } from 'redux'
import transitApp from './reducers.js'

let store = createStore(transitApp);

export default store;
