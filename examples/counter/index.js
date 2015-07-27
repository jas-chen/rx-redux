import Rx from 'rx'
import {createStore, combineReducers} from 'rx-redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'
import * as CounterActions from './actions/CounterActions'

const updateCounter = (() => {
    const counter = document.getElementById('count');

    return (state) => {
        console.log('update UI with state:', state);
        counter.textContent = state.counter.toString();
    }
})();


const decreaseAction$ = (() => {
    const decrease = document.getElementById('btn-decrease');
    const event$ = Rx.Observable.fromEvent(decrease, 'click');
    return event$.map(CounterActions.decrement);
})();

const increaseAction$ = (() => {
    const increase = document.getElementById('btn-increase');
    const event$ = Rx.Observable.fromEvent(increase, 'click');
    return event$.map(CounterActions.increment);
})();

const increaseIfOddAction$ = (() => {
    const increase = document.getElementById('btn-odd');
    const event$ = Rx.Observable.fromEvent(increase, 'click');
    return event$.map(CounterActions.incrementIfOdd);
})();

const action$ = Rx.Observable.merge(decreaseAction$, increaseAction$, increaseIfOddAction$);
// const action$ = Rx.Observable.just(initAction);

function dumbMiddleware(id) {
    return () => {
        return next => action => {
            console.log(`dumb middleware ${id}`);
            return next(action)
        }
    }
}

//const newCreateStore = applyMiddleware(dumbMiddleware(1), thunkMiddleware, dumbMiddleware(2))(createStore);
const reducer = combineReducers(reducers);

//const {dispatcher$, state$} = createStore(reducer);
const {dispatcher$, state$, getReducer, replaceReducer, subscribe, getState} = createStore(reducer);

updateCounter(getState());

state$.subscribe(
    updateCounter,
    err => console.error(err.stacktrace),
    () => console.warn('state$ stream completed.')
);

action$.subscribe(action => dispatcher$.onNext(action));

// dispatcher$.onNext({type: '@@INIT' + Math.random()});

subscribe(() => {
    console.log('listener get called. state:', getState());
});

window.reducer1 = getReducer();
window.reducer2 = function counter(state = 0, action = {}) {
    switch (action.type) {
        case 'INCREMENT_COUNTER':
            return {counter: state.counter + 2};
        case 'DECREMENT_COUNTER':
            return {counter: state.counter - 2};
        default:
            return {counter: state.counter};
    }
};

window.replaceReducer = replaceReducer;
//dispatcher$.onCompleted();