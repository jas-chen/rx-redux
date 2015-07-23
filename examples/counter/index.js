import Rx from 'rx';
import rxRedux from 'rx-redux';
import reducers from './reducers'
import * as CounterActions from './actions/CounterActions';

const count = document.getElementById('count');


function decreaseListener() {
    const decrease = document.getElementById('btn-decrease');
    const event$ = Rx.Observable.fromEvent(decrease, 'click');
    const action$ = event$.map(CounterActions.decrement);

    return action$;
}

function increaseListener() {
    const increase = document.getElementById('btn-increase');
    const event$ = Rx.Observable.fromEvent(increase, 'click');
    const action$ = event$.map(CounterActions.increment);

    return action$;
}

const actions = [decreaseListener(), increaseListener()];
const initAction = {};
const action$ = Rx.Observable.merge(actions).startWith(initAction);
const {state$, start} = rxRedux(action$, reducers);

state$.subscribe(
    function (x) {
        count.textContent = x;
    },
    function (err) {
        console.log('state$ error: ', err.stack);
    },
    function () {
        console.log('state$ completed');
    });

start();