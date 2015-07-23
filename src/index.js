export default function(action$, reducers, initState){
    console.info('initialize rx-redux');

    const nextState$ = new Rx.Subject();

    const currentState$ = Rx.Observable.create(function(observer){
        console.log('init state:', initState);
        observer.onNext(initState);

        nextState$.subscribe(
            function (state) {
                console.log('set current state to:', state);
                observer.onNext(state);
            },
            function (err) {
                console.error('subject error: ', err.stacktrace);
            },
            function () {
                console.log('subject completed');
            });
    });

    function start() {
        console.log('start');

        const dispatcher$ = action$.withLatestFrom(currentState$, function(action, state){
            console.log('dispatcher get action:', action.type, ', current state:', state);
            reducers.forEach(function(reducer){
                state = reducer(state, action);
            });

            return {action: action, state: state};
        });

        dispatcher$.subscribe(
            function (result) {
                console.log('action:', result.action, 'completed, change state to:', result.state);
                nextState$.onNext(result.state);
            },
            function (err) {
                console.error('dispatcher$ error:', err.stacktrace);
            },
            function () {
                console.log('dispatcher$ completed');
            });
    }

    return {
        start: start,
        state$: nextState$
    }
}