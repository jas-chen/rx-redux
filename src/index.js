import createStore from './createStore';
import combineReducers from './utils/combineReducers';
import bindActionCreators from './utils/bindActionCreators';
import applyMiddleware from './utils/applyMiddleware';
import compose from './utils/compose';
import connectAction from './utils/connectAction';

export default {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  connectAction
};
