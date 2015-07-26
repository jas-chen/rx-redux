import Rx from 'rx'
import {createStore, combineReducers} from 'rx-redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'
import * as CounterActions from './actions/CounterActions'

const counter = document.getElementById('count');

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

const initAction = {};
const action$ = Rx.Observable.merge(decreaseAction$, increaseAction$, increaseIfOddAction$).startWith(initAction);
// const action$ = Rx.Observable.just(initAction);

function dumbMiddleware(id) {
    return () => {
        return next => action => {
            console.log(`dumb middleware ${id}`);
            return next(action)
        }
    }
}

// const newCreateStore = applyMiddleware(dumbMiddleware(1), thunkMiddleware, dumbMiddleware(2))(createStore);
const {dispatcher$, state$} = createStore(combineReducers(reducers));

state$.subscribe(
    state => {
        console.log('update UI');
        counter.textContent = state.counter;
    }
);

action$.subscribe(action => {
    console.log('action get:', action);
    dispatcher$.onNext(action);
});
