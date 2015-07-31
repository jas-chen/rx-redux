import Rx from 'rx';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware(getState) {
  return action => {
    if(isPromise(action)) {
      return Rx.Observable.fromPromise(action);
    }

    return Rx.Observable.just(action);
  };
}