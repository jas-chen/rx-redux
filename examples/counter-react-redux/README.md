Counter react-redux demo
========================

Example of using [react-redux](https://github.com/gaearon/react-redux) with rx-redux.

The code is took from [redux/examples/counter](https://github.com/gaearon/redux/tree/breaking-changes-1.0/examples/counter), the only difference is you have to call `state$.subscribe()` ([see the code](./containers/App.js#L12-L13)).

## How to run?
```
cd examples/counter-react-redux
npm install
npm start
open http://localhost:8080
```
