rx-redux
========

[![npm version](https://img.shields.io/npm/v/rx-redux.svg?style=flat-square)](https://www.npmjs.com/package/rx-redux)

A reimplementation of [redux](https://github.com/gaearon/redux) using [RxJS](https://github.com/Reactive-Extensions/RxJS).

## Why?
Reactive by default.

## Features
- All of the [redux APIs](https://github.com/gaearon/redux/blob/rewrite-docs/docs/Reference/API.md) implemented.
- Additionally, `store` provides 2 rx objects you can utilize:
    - `dispatcher$` is a [Subject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md) that you can pass actions in.
    - `state$` is an [Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md), a stream of states.
- And one helper function `import { connectAction } from 'rx-redux';`
  - You can use `connectAction(action$, store)` to stream actions to dispatcher.

## What does it look like?
``` javascript
import {createStore, combineReducers, applyMiddleware} from 'rx-redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'
import { render, getActionStream } from './view'

const action$ = getActionStream();

const newCreateStore = applyMiddleware(thunkMiddleware)(createStore);
const reducer = combineReducers(reducers);
const store = newCreateStore(reducer);

// stream states to view
store.state$.subscribe(state => render(state));

// stream actions to dispatcher
action$.subscribe(action => store.dispatcher$.onNext(action));
```

## Best practice to make your app all the way reactive
**Don't** do async in `Middleware`, create `RxMiddleware` instead.

### RxMiddleware
Which wrap action stream.

Look like this
```javascript
import Rx from 'rx';

export default function thunkMiddleware(getState) {
  return action => {
    if(typeof action === 'function') {
      return Rx.Observable.just(action(getState));
    }

    // Don't know how to handle this thing, pass to next rx-middleware
    return Rx.Observable.just(action);
  };
}

```

How to design `RxMiddleware`
- Get action, return [Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md).
- **Must** return Observable.
- If you don't want to return a action (eg. if counter is not odd), return a `dummy action`.

[See RxMiddleware example](./examples/counter-rx)

## WIP
- Figure out how to test a Rx project (No experience before).
- Work with Hot Module Replacement.
- Work with [redux-devtools](https://github.com/gaearon/redux-devtools).
- More examples.

## Inspiration
- [redux](https://github.com/gaearon/redux), learn a lot through the source code.
- [Cycle.js](http://cycle.js.org/) for the cool MVI flow.

## License
[The MIT License (MIT)](./LICENSE)
