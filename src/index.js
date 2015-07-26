import Rx from 'rx'
import isPlainObject from './utils/isPlainObject'
import combineReducers from './utils/combineReducers'

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
    const dispatch = createDispatch(initState, reducer);
    const dispatcher$ = new Rx.Subject();
    const state$ = dispatcher$.map(dispatch);

    return {state$, dispatcher$}
}

export default {
    createStore,
    combineReducers
}