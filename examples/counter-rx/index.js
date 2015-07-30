import {createStore, combineReducers} from 'rx-redux';
import thunkMiddleware from './rx-middleware/thunkMiddleware';
import promiseMiddleware from './rx-middleware/promiseMiddleware';
import delayMiddleware from './rx-middleware/delayMiddleware';
import { DUMMY_ACTION } from './constants/ActionTypes';
import * as reducers from './reducers';
import { render, getActionStream } from './view';

const reducer = combineReducers(reducers);
const store = createStore(reducer);

// stream states to view
store.state$.subscribe(state => render(state));

function applyRxMiddleware(action$, ...middleware) {
  return middleware.reduce((prev, cur) => {
    return prev.flatMap(cur(store.getState));
  }, action$);
}

const action$ = getActionStream();
const actionWithMiddleware$ = applyRxMiddleware(action$, thunkMiddleware, promiseMiddleware, delayMiddleware);
const cleanAction$ = actionWithMiddleware$.filter(action => action.type !== DUMMY_ACTION);

// stream actions to dispatcher
cleanAction$.subscribe(action => store.dispatcher$.onNext(action));