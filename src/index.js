export default function(action$, reducers, initState){
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

    function start() {
        console.log('start');

        const dispatcher$ = action$.withLatestFrom(currentState$, (action, state) => {
            console.log('dispatcher get action:', action.type, ', current state:', state);
            reducers.forEach(reducer => {
                state = reducer(state, action);
            });

            return {action, state}
        });

        dispatcher$.subscribe(
            result => {
                console.log('action:', result.action, 'completed, change state to:', result.state);
                nextState$.onNext(result.state);
            },
            err => console.error('dispatcher$ error:', err.stacktrace),
            () => console.log('dispatcher$ completed')
        );
    }

    return {
        start,
        state$: nextState$
    }
}