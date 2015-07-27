import Rx from 'rx/dist/rx.lite.compat';
import createStore from './createStore';
import combineReducers from './utils/combineReducers';
import bindActionCreators from './utils/bindActionCreators';
import applyMiddleware from './utils/applyMiddleware';
import compose from './utils/compose';

export default {
  Rx,
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose
};
