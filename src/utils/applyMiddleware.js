import Rx from 'rx'
import compose from './compose'

function createNewDispatch(middleware, store) {
    const dispatches = middleware.map(m => m(store));
    dispatches.push(store.dispatch);

    return compose(...dispatches);
}

function createNewDispatcher(middleware, store) {
    const newDispatch = createNewDispatch(middleware, store);
    const newDispatcher$ = new Rx.Subject();
    newDispatcher$.subscribe(newDispatch);

    return newDispatcher$;
}

export default function applyMiddleware(...middleware) {
    return function(createStore) {
        return function(reducer, initState) {
            const store = createStore(reducer, initState);
            const newDispatcher$ = createNewDispatcher(middleware, store);

            store.dispatcher$ = newDispatcher$;
            store.dispatch = newDispatcher$.onNext.bind(newDispatcher$);

            return store;
        }
    }
}