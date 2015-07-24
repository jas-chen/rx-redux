import Rx from 'rx';
import rxRedux from 'rx-redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from './reducers'
import * as CounterActions from './actions/CounterActions';

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


const {state$, start, replaceDispatcher, getDispatcher, getState} = rxRedux.createStore(reducers);

state$.subscribe(
    state => {
        console.log('update UI');
        counter.textContent = state.counter;
    }
);

const dispatcher$ = getDispatcher();
const dispatch = dispatcher$.onNext.bind(dispatcher$);

function applyMiddleware(store, dispatcher, middleware) {
    const m$ = new Rx.Subject();
    const next = m$.onNext.bind(m$);
    dispatcher.subscribe(action => {
        middleware(store)(next)(action);
    });
}

applyMiddleware({dispatch, getState}, dispatcher$, thunkMiddleware);

replaceDispatcher(dispatcher$);

start(action$);




// window.odd = CounterActions.incrementIfOdd;