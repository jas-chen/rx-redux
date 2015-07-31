import Rx from 'rx';

export default function thunkMiddleware(getState) {
  return action => {
    if(typeof action === 'function') {
      return Rx.Observable.just(action(getState));
    }

    return Rx.Observable.just(action);
  };
}
