import Rx from 'rx'
import isPlainObject from './utils/isPlainObject'
import combineReducers from './utils/combineReducers'
import applyMiddleware from './utils/applyMiddleware'

function createDispatch(initState, reducer) {
    let state = initState;

    function dispatch(action) {
        if(!isPlainObject(action)) {
            console.error('[reducer] Action:', action,'is not plain object. Current state will be returned.');
        }
        else {
            state = reducer(state, action);
        }

        return state
    }

    return {
        dispatch,
        getState: () => state
    }
}

function createStore(reducer, initState) {
    const {dispatch, getState} = createDispatch(initState, reducer);
    const dispatcher$ = new Rx.Subject();

    dispatcher$.subscribeOnCompleted(() => {
        console.warn('[rx-redux] dispatcher$ stream completed.');
    });

    const state$ = dispatcher$.map(dispatch);

    return {
        state$,
        dispatcher$,
        getState,
        dispatch: dispatcher$.onNext.bind(dispatcher$),
        getReducer: () => reducer,
        replaceReducer: (newReducer) => { reducer = newReducer; }
    }
}

export default {
    createStore,
    combineReducers,
    applyMiddleware
}