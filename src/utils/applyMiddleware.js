function wrapDispatcher(store, dispatcher, middleware) {
    const m$ = new Rx.Subject();
    const next = m$.onNext.bind(m$);
    dispatcher.subscribe(action => {
        middleware(store)(next)(action);
    });

    return m$;
}

export default function applyMiddleware(...middleware) {
    return function(createStore) {
        return function(reducers) {
            const newCreateStore = createStore(reducers);

            const dispatcher$ = newCreateStore.getDispatcher();
            const dispatch = dispatcher$.onNext.bind(dispatcher$);
            const store = {
                dispatch,
                getState: newCreateStore.getState
            };

            middleware.reduce((prev, cur) => wrapDispatcher(store, prev, cur), dispatcher$);

            newCreateStore.replaceDispatcher(dispatcher$);

            return newCreateStore
        }
    }
}