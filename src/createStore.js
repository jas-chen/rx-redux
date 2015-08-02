import Rx from 'rx';
import isPlainObject from './utils/isPlainObject';

export default function createStore(reducer, initState) {
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  const initAction = {type: '@@rx-redux/INIT_' + (new Date()).getTime()};
  const listeners = [];
  const dispatcher$ = new Rx.ReplaySubject();
  const currentReducer$ = new Rx.BehaviorSubject(reducer);

  function currentReducer(state, action) {
    const reducer = currentReducer$.getValue();
    return reducer(state, action);
  }

  function callListeners() {
    listeners.forEach(listener => listener());
  }

  function dispatch(action) {
    dispatcher$.onNext(action);
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);

    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function replaceReducer(newReducer) {
    currentReducer$.onNext(newReducer);
  }

  function getInitialState() {
    return currentReducer(initState, initAction);
  }

  function reduce(state, action) {
    if (!isPlainObject(action)) {
      throw new Error('Actions must be plain objects.');
    }

    return currentReducer(state, action);
  }

  const state$ = new Rx.BehaviorSubject(getInitialState());

  currentReducer$
    .flatMapLatest(() => dispatcher$.scan(getInitialState(), reduce))
    .subscribe(state$.onNext.bind(state$));

  // must call state$.subscribe() to start life cycle
  state$.subscribe(
    callListeners,
    err => { throw err; }
  );

  return {
    state$,
    dispatcher$,
    getState: () => state$.getValue(),
    dispatch,
    subscribe,
    getReducer: () => currentReducer$.getValue(),
    replaceReducer
  };
}
