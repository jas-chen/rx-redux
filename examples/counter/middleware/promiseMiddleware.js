function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default function promiseMiddleware({ dispatch, getState }) {
  return next => action =>
    isPromise(action)
      ? action.then(dispatch)
      : next(action);
}