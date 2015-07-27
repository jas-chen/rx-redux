import Rx from 'rx'
import isPlainObject from './utils/isPlainObject'

function createDispatcher() {
    const dispatcher$ = new Rx.Subject();

    dispatcher$.subscribeOnCompleted(() => {
        console.warn('[rx-redux] dispatcher$ stream completed.');
    });

    return dispatcher$;
}

export default function createStore(reducer, initState) {
    const initAction = {type: '@@rx-redux/INIT_' + Math.random()};
    const listeners = [];
    function callListeners() { listeners.forEach(listener => listener()); }

    const dispatcher$ = createDispatcher();
    const state$ = dispatcher$.map(reduce).do(callListeners);

    let state = reducer(initState, initAction);

    function reduce(action) {
        if(!isPlainObject(action)) {
            console.error('[reducer] Action:', action,'is not a plain object. Current state will be returned.');
        }
        else {
            state = reducer(state, action);
        }

        return state
    }

    function dispatch(action) {
        dispatcher$.onNext(action);
        return action;
    }

    function subscribe(listener) {
        // this doesn't work, so sad.
        // state$.do(listener);

        listeners.push(listener);
        return () => listeners.splice(listeners.indexOf(listener), 1)
    }

    function replaceReducer(newReducer) {
        reducer = newReducer;
        dispatch(initAction);
    }

    return {
        state$,
        dispatcher$,
        getState: () => state,
        dispatch,
        subscribe,
        getReducer: () => reducer,
        replaceReducer
    }
}