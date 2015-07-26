import Rx from 'rx'
import isPlainObject from './utils/isPlainObject'
import combineReducers from './utils/combineReducers'

function log(name, o$) {
    name = '[' + name + '] ';
    o$.doOnError(e => console.error(name, e.stacktrace));
    o$.doOnCompleted(() => console.warn(name + 'stream completed'));
}

function createDispatch(initState, reducer) {
    let state = initState;

    return (action) => {
        if(!isPlainObject(action)) {
            const error = new Error('action should be plain Object.');
            console.error(error);
            throw error;
        }

        console.info('[reducer] get action:', action, ', state:', state);
        state = reducer(state, action);
        console.info('[reducer] dispatch new state:', state);

        return state
    }
}

function createStore(reducer, initState = {}){
    console.info('[rx-redux] initialize rx-redux');
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