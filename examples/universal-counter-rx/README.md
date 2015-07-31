Universal Counter demo
======================

## This project shows the difference from original redux
In redux, to make app universal you have to gather all your Promises returnned from dispatch(), this could be painful if you have many Promises.

In rx-redux (with RxMiddleware) you only have to subscribe for stream completed.

> This example works but the code is messy, will clean it up soon.

## How to run?
```
cd examples/universal-counter-rx
npm install
npm start
open http://localhost:3000
```
