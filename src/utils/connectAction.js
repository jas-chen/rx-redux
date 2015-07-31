export default function connectAction(action$, store) {
  action$.subscribe(
    (action) => {
      store.dispatch(action)
    },
    (err) => {
      throw new Error(err);
    },
    () => {
      store.dispatcher$.onCompleted();
    }
  );
};
