import Rx from 'rx';

function createStore(reducers, initState = {}){
    console.info('initialize rx-redux');

    const nextState$ = new Rx.Subject();

    const currentState$ = Rx.Observable.create(observer => {
        console.log('init state:', initState);
        observer.onNext(initState);

        nextState$.subscribe(
                state => {
                console.log('set current state to:', state);
                observer.onNext(state);
            },
                err => console.error('subject error: ', err.stacktrace),
            () => console.log('subject completed')
        );
    });

    reducers = Object.keys(reducers).reduce((result, key) => {
        if(typeof reducers[key] === 'function') {
            result[key] = reducers[key];
        }

        return result;
    }, {});

    function sendToReducer(action, state) {
        console.log('dispatcher get action:', action, ', current state:', state);

        for(var name in reducers) {
            state[name] = reducers[name](state[name], action);
        }

        return {action, state}
    }

    const baseDispatcher$ = new Rx.Subject();

    let dispatcher$ = new Rx.Subject();

    function start(action$) {
        console.log('start');

        baseDispatcher$.subscribeOnNext(action => dispatcher$.onNext(action));

        dispatcher$.withLatestFrom(currentState$, sendToReducer).subscribe(
            result => {
                console.log('action:', result.action, 'completed, change state to:', result.state);
                nextState$.onNext(result.state);
            },
            err => console.error('dispatcher$ error:', err.stacktrace),
            () => console.log('dispatcher$ completed')
        );

        action$.subscribeOnNext(action => baseDispatcher$.onNext(action));
    }

    const getState = (() => {
        let state;
        nextState$.subscribe(
                nextState => {
                state = nextState;
            }
        );

        return () => state;
    })();

    return {
        start,
        state$: nextState$,
        getState,
        getDispatcher: () => dispatcher$,
        replaceDispatcher: (newDispatcher$) => dispatcher$ = newDispatcher$
    }
}

export default {
    createStore
}