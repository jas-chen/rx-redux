import Rx from 'rx'
import isPlainObject from './utils/isPlainObject'
import combineReducers from './utils/combineReducers'

function log(name, o$) {
    name = '[' + name + '] ';
    o$.doOnError(e => console.error(name, e.stacktrace));
    o$.doOnCompleted(() => console.warn(name + 'Stream completed'));
}

function createDispatch(initState, reducer) {
    let state = initState;

    return (action) => {
        if(!isPlainObject(action)) {
            console.error('[reducer] Action:', action,'is not plain object. Current state will be returned.');
        }
        else {
            state = reducer(state, action);
        }

        return state
    }
}

function createStore(reducer, initState) {
    console.info('[rx-redux] Create store with initial state:', initState);

    const dispatch = createDispatch(initState, reducer);
    const dispatcher$ = new Rx.Subject();
    const state$ = dispatcher$.map(dispatch);

    log('dispatcher$', dispatcher$);
    log('state$', state$);

    return {state$, dispatcher$}
}

export default {
    createStore,
    combineReducers
}