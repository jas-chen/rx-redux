import {createStore, combineReducers, applyMiddleware} from 'rx-redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'
import { render, getActionStream } from './view'

const action$ = getActionStream();

const newCreateStore = applyMiddleware(thunkMiddleware)(createStore);
const reducer = combineReducers(reducers);
const store = newCreateStore(reducer);

// set view to initial state
render(store.getState());

// stream states to view
store.state$.subscribe(state => render(state));

// stream actions to dispatcher
action$.subscribe(action => store.dispatcher$.onNext(action));