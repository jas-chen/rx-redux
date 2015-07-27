import Rx from 'rx/dist/rx.lite.compat';
import isPlainObject from './utils/isPlainObject';

export default function createStore(reducer, initState) {
  const initAction = {type: '@@rx-redux/INIT_' + (new Date()).getTime()};
  let currentReducer = reducer;
  const listeners = [];

  function callListeners() {
    listeners.forEach(listener => listener());
  }

  let state = currentReducer(initState, initAction);

  function reduce(action) {
    if (!isPlainObject(action)) {
      throw new Error('[reducer] Action must be a plain object. Current state will be returned.');
    } else {
      state = currentReducer(state, action);
    }

    return state;
  }

  const dispatcher$ = new Rx.Subject();
  const state$ = dispatcher$.map(reduce).do(callListeners);

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
