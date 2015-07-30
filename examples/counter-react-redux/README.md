Counter react-redux demo
========================

Example of using [react-redux](https://github.com/gaearon/react-redux) with rx-redux.

The code is took from [redux/examples/counter](https://github.com/gaearon/redux/tree/breaking-changes-1.0/examples/counter), the only difference is you have to call `state$.subscribe()` in top-level app component ([see the code](./containers/App.js#L14-L17)).

## How to run?
```
cd examples/counter-react-redux
npm install
npm start
open http://localhost:8080
```
