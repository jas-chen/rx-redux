import Rx from 'rx'
import isPlainObject from './utils/isPlainObject'
import combineReducers from './utils/combineReducers'
import bindActionCreators from './utils/bindActionCreators'
import applyMiddleware from './utils/applyMiddleware'
import compose from './utils/compose'

const initAction = {type: '@@rx-redux/INIT_' + Math.random()};

function createDispatch(reducer) {
    let state;
    const listeners = [];

    function dispatch(action) {
        if(!isPlainObject(action)) {
            console.error('[reducer] Action:', action,'is not plain object. Current state will be returned.');
        }
        else {
            state = reducer(state, action);
            listeners.forEach(listener => listener());
        }

        return state
    }

    function subscribe(listener) {
        listeners.push(listener);
        return () => listeners.splice(listeners.indexOf(listener), 1)
    }

    function replaceReducer(newReducer) {
        reducer = newReducer;
        console.log('new reducer:', reducer);
        dispatch(initAction);
    }

    return {
        dispatch,
        subscribe,
        getState: () => state,
        setState: (newState) => { state = newState; },
        replaceReducer
    }
}

function createStore(reducer, initState) {
    const {dispatch, getState, subscribe, setState, replaceReducer} = createDispatch(reducer);
    setState(reducer(initState, initAction));
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
        subscribe,
        getReducer: () => reducer,
        replaceReducer
    }
}

export default {
    createStore,
    combineReducers,
    applyMiddleware,
    compose,
    bindActionCreators
}