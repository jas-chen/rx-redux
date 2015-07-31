import thunkMiddleware from './rx-middleware/thunkMiddleware';
import promiseMiddleware from './rx-middleware/promiseMiddleware';
import delayMiddleware from './rx-middleware/delayMiddleware';
import { DUMMY_ACTION } from './constants/ActionTypes';

import {combineReducers} from 'rx-redux';
import * as reducers from './reducers';

const middleware = [thunkMiddleware, promiseMiddleware, delayMiddleware];

export function applyRxMiddleware(action$, store) {
  const newAction$ = middleware.reduce((prev, cur) => {
    return prev.flatMap(cur(store.getState));
  }, action$);

  return newAction$; // .filter(action => action.type !== DUMMY_ACTION);
}

export const reducer = combineReducers(reducers);