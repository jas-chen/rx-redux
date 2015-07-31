Universal Counter demo
======================

## This project shows the difference from original redux
In redux, to make an universal app you have to gather all your Promises returnned from dispatch() in server, this could be painful if you have many Promises.

In rx-redux (with RxMiddleware), subscribe for stream completed event and you are done. [See code](./src/server/index.js#L25).

## How to run?
```
cd examples/universal-counter-rx
npm install
npm start
open http://localhost:3000
```
