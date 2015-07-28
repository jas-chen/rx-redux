import Rx from 'rx';
import compose from './compose';

function createNewDispatch(middleware, store) {
  const dispatchFunctions = middleware.map(m => m(store));
  dispatchFunctions.push(store.dispatch);

  return compose(...dispatchFunctions);
}

function createNewDispatcher(middleware, store) {
  const newDispatch = createNewDispatch(middleware, store);
  const newDispatcher$ = new Rx.Subject();
  newDispatcher$.subscribe(newDispatch);

  return newDispatcher$;
}

export default function applyMiddleware(...middleware) {
  return (createStore) => (reducer, initState) => {
    const store = createStore(reducer, initState);
    const newDispatcher$ = createNewDispatcher(middleware, store);

    store.dispatcher$ = newDispatcher$;
    store.dispatch = (action) => {
      newDispatcher$.onNext(action);
      return action;
    };

    return store;
  };
}
