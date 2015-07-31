import React, { Component } from 'react';
import { CounterApp } from './CounterApp';
import { createStore, applyMiddleware, combineReducers } from 'rx-redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import * as reducers from '../reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// initialize state$
store.state$.subscribe();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <CounterApp />}
      </Provider>
    );
  }
}