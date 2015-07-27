rx-redux
========

[![npm version](https://img.shields.io/npm/v/rx-redux.svg?style=flat-square)](https://www.npmjs.com/package/rx-redux)

A reimplementation of [redux](https://github.com/gaearon/redux) using [RxJS](https://github.com/Reactive-Extensions/RxJS).

## Why?
Reactive by default.

## Features
- All [redux APIs](https://github.com/gaearon/redux/blob/rewrite-docs/docs/Reference/API.md) provided.
- `Store` has 2 rx objects you can use:
    - `dispatcher$` is a [Subject](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md) that you can pass actions in.
    - `state$` is an [Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md), a stream of states.

## What does it look like?
``` javascript
import {createStore, combineReducers, applyMiddleware} from 'rx-redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'
import { render, getActionStream } from './view'

const action$ = getActionStreamFrom();

const newCreateStore = applyMiddleware(thunkMiddleware)(createStore);
const reducer = combineReducers(reducers);
const store = newCreateStore(reducer);

// set view to initial state
render(store.getState());

// stream states to view
store.state$.subscribe(state => render(state));

// stream actions to dispatcher
action$.subscribe(action => store.dispatcher$.onNext(action));
```

## Running Examples
```
git clone https://github.com/jas-chen/rx-redux.git
cd rx-redux
npm install

cd examples/counter-dom-rx
npm install
npm start
open http://localhost:8080
```

## WIP
- Figure out how to test a Rx project (No experience before).
- Work with Hot Module Replacement.
- Work with [redux-devtools](https://github.com/gaearon/redux-devtools).
- More examples.

## Inspiration
- [redux](https://github.com/gaearon/redux), have learn a lot through the source code.
- [Cycle.js](http://cycle.js.org/) for the cool MVI flow.

## License
[The MIT License (MIT)](./LICENSE)
