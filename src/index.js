import Rx from 'rx'
import applyMiddleware from './utils/applyMiddleware'

function finalReducers(reducers) {
    return Object.keys(reducers).reduce((result, key) => {
        if(typeof reducers[key] === 'function') {
            result[key] = reducers[key];
        }

        return result;
    }, {})
}

function createState$(initState, nextState$) {
    const state$ = new Rx.Subject();
    nextState$.subscribe(
        state => {
            console.info('[state$] set state to:', state);
            state$.onNext(state);
        }
    );

    return state$;
}

function createGetState(nextState$) {
    let state;
    nextState$.subscribe(nextState => state = nextState);
    return () => state;
}

function log(name, o$) {
    name = '[' + name + '] ';
    o$.subscribeOnError(e => console.error(name, e.stacktrace));
    o$.subscribeOnCompleted(() => console.warn(name + 'stream completed'));
}

function createStore(reducers, initState = {}){
    console.info('[rx-redux] initialize rx-redux');

    reducers = finalReducers(reducers);

    const nextState$ = new Rx.Subject();
    const state$ = createState$(initState, nextState$);
    const getState = (createGetState)(nextState$);

    const baseDispatcher$ = new Rx.Subject();
    let dispatcher$ = new Rx.Subject();

    log('baseDispatcher$', baseDispatcher$);
    log('dispatcher$', dispatcher$);
    log('nextState$', nextState$);
    log('state$', state$);

    baseDispatcher$.subscribeOnCompleted(() => dispatcher$.onCompleted());
    dispatcher$.subscribeOnCompleted(() => nextState$.onCompleted());
    nextState$.subscribeOnCompleted(() => state$.onCompleted());

    function startSubscribe(action$) {
        console.info('[rx-redux] start subscribe action stream');

        baseDispatcher$.subscribe(
            action => dispatcher$.onNext(action)
        );

        function sendToReducer(action, state) {
            console.info('[dispatcher$] get action:', action, ', state:', state);

            for(var name in reducers) {
                state[name] = reducers[name](state[name], action);
            }

            return {action, state}
        }

        dispatcher$.withLatestFrom(state$, sendToReducer).subscribe(
            result => {
                console.info('[dispatcher$] action:', result.action, 'done, dispatch next state:', result.state);
                nextState$.onNext(result.state);
            },
            e => console.error('[dispatcher$.withLatestFrom(state$)]', e.stacktrace),
            () => console.warn('[dispatcher$.withLatestFrom(state$)] stream completed')
        );

        console.info('[state$] init state:', initState);
        state$.onNext(initState);

        /*
         err => console.error('dispatcher$ error:', err.stacktrace),
         () => console.log('dispatcher$ completed')
        */

        action$.subscribe(action => baseDispatcher$.onNext(action));
        log('action$', action$);
        action$.subscribeOnCompleted(() => baseDispatcher$.onCompleted());
    }

    return {
        startSubscribe,
        state$,
        getState,
        getDispatcher: () => dispatcher$,
        replaceDispatcher: (newDispatcher$) => dispatcher$ = newDispatcher$
    }
}

export default {
    createStore,
    applyMiddleware
}