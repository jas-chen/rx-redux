import Rx from 'rx';

const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';


const count = document.getElementById('count');


function decreaseListener() {
    const decrease = document.getElementById('btn-decrease');
    const event$ = Rx.Observable.fromEvent(decrease, 'click');
    const action$ = event$.map(function(e){
        return {
            type: DECREMENT_COUNTER
        };
    });

    return action$;
}

function increaseListener() {
    const increase = document.getElementById('btn-increase');
    const event$ = Rx.Observable.fromEvent(increase, 'click');
    const action$ = event$.map(function(e){
        return {
            type: INCREMENT_COUNTER
        };
    });

    return action$;
}

const actions = [decreaseListener(), increaseListener()];

const action$ = Rx.Observable.merge(actions).startWith({});

function countReducer(state, action) {
    console.log(`reducer countReducer get action ${action.type} and state ${state}`);

    if(state == null) {
        state = 0;
    }

    switch (action.type) {
        case INCREMENT_COUNTER:
            return state + 1;
        case DECREMENT_COUNTER:
            return state - 1;
        default:
            return state;
    }
}

const reducers = [countReducer];


var subject = new Rx.Subject();


const state$ = Rx.Observable.create(function(observer){
    observer.onNext();

    subject.subscribe(
        function (x) {
            observer.onNext(x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        });
});

state$.subscribe(
    function (x) {
        count.textContent = x;
    },
    function (err) {
        console.log('state$ error: ' + err);
    },
    function () {
        console.log('state$ completed');
    });

action$.subscribe(
    function (action) {
        console.log(`action ${action.type} fired`);
    },
    function (err) {
        console.log('action$ error: ' + err);
    },
    function () {
        console.log('action$ completed');
    });

const dispatcher$ = action$.withLatestFrom(state$, function(action, state){
    console.log(`dispatcher get action ${action.type}`);
    reducers.forEach(function(reducer){
        state = reducer(state, action);
    });

    return {action: action, state: state};
});

dispatcher$.subscribe(
    function (result) {
        subject.onNext(result.state);
        console.log(`action ${result.action.type} completed, change state to ${result.state}`);
    },
    function (err) {
        console.log('state$ error: ' + err);
    },
    function () {
        console.log('state$ completed');
    });