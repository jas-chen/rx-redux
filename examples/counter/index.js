import Rx from 'rx';
import rxRedux from 'rx-redux';
import reducers from './reducers'
import * as CounterActions from './actions/CounterActions';

const counter = document.getElementById('count');

const decreaseAction$ = (function() {
    const decrease = document.getElementById('btn-decrease');
    const event$ = Rx.Observable.fromEvent(decrease, 'click');
    return event$.map(CounterActions.decrement);
}());

const increaseAction$ = (function() {
    const increase = document.getElementById('btn-increase');
    const event$ = Rx.Observable.fromEvent(increase, 'click');
    return event$.map(CounterActions.increment);
}());

const initAction = {};
const action$ = Rx.Observable.merge(decreaseAction$, increaseAction$).startWith(initAction);
const {state$, start} = rxRedux(action$, reducers);

state$.subscribe(
    function (count) {
        console.log('update UI');
        counter.textContent = count;
    },
    function (err) {
        console.log('state$ error: ', err.stack);
    },
    function () {
        console.log('state$ completed');
    });

start();