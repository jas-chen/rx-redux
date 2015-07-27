import Rx from 'rx/dist/rx.lite.compat';
import isPlainObject from './utils/isPlainObject';

export default function createStore(reducer, initState) {
  const initAction = {type: '@@rx-redux/INIT_' + (new Date()).getTime()};
  const listeners = [];
  const dispatcher$ = new Rx.Subject();

  let currentReducer = reducer;
  let state = currentReducer(initState, initAction);

  function callListeners() {
    listeners.forEach(listener => listener());
  }

  function dispatch(action) {
    dispatcher$.onNext(action);
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => listeners.splice(listeners.indexOf(listener), 1);
  }

  function replaceReducer(newReducer) {
    currentReducer = newReducer;
    dispatch(initAction);
  }

  function reduce(action) {
    if (!isPlainObject(action)) {
      throw new Error('Action must be a plain object.');
    } else {
      state = currentReducer(state, action);
    }

    return state;
  }

  const state$ = dispatcher$.map(reduce).do(callListeners);

  return {
    state$,
    dispatcher$,
    getState: () => state,
    dispatch,
    subscribe,
    getReducer: () => currentReducer,
    replaceReducer
  };
}
