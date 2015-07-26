function wrapDispatcher(store, dispatcher, middleware) {
    const m$ = new Rx.Subject();
    const next = m$.onNext.bind(m$);
    dispatcher.subscribe(action => {
        middleware(store)(next)(action);
    });

    return m$;
}

function chainMiddleware(middleware, store) {
    let dispatch;
    middleware.reduceRight((nextMiddleware, middleware) => {
        dispatch = middleware(store)(nextMiddleware);
        return middleware;
    });

    return dispatch;
}

export default function applyMiddleware(...middleware) {
    return function(createStore) {
        return function(reducers) {
            const store = createStore(reducers);

            const dispatcher$ = store.getDispatcher();

            /*
            let last$;
            middleware.reduce((cur, next) => {
                last$ = wrapDispatcher(store, cur, next);
                return last$
            }, dispatcher$);

             store.replaceDispatcher(last$);
            */

            const newDispatch = chainMiddleware(middleware, store);
            const newDispatcher$ = new Rx.Subject();

            dispatcher$.subscribe(action => {
                newDispatcher$.onNext(newDispatch(action));
            });

            store.replaceDispatcher(dispatcher$.map(dispatch));

            return store
        }
    }
}