Universal Counter demo
======================

This example is [moved](https://github.com/jas-chen/redux-core/tree/master/examples/universal-counter).

## This project shows the difference from original redux
In redux, to make an universal app you have to gather all your Promises returned from dispatch() in server side, this could be painful if you have many Promises.

In rx-redux (with RxMiddleware), subscribe for stream completed event and you are done.

