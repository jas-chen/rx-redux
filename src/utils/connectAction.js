export default function connectAction(action$, store) {
  action$.subscribe(
    (action) => {
      store.dispatch(action)
    },
    (err) => {
      store.dispatcher$.onError(err);
    },
    () => {
      store.dispatcher$.onCompleted();
    }
  );
};
