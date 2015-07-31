import express from 'express';
import path from 'path';
import { createStore, connectAction } from 'rx-redux';
import { reducer, applyRxMiddleware } from '../shared';
import getActionStream from './utils/getActionStream';
import render from './utils/render';

var app = express();

// main
app.get('/', function (req, res) {
  console.log('\n\nReceive request with query string: ' + req.query.action);

  const store = createStore(reducer);
  const action$ = applyRxMiddleware(getActionStream(req.query), store);
  let finalState = store.getState();

  // subscribe state$, return rendered page when completed.
  store.state$.subscribe(
    state => {
      console.log(state);
      finalState = state;
    },
    err => { throw new Error(err); },
    () => { res.send(render(finalState)); }
  );

  // stream actions to dispatcher
  connectAction(action$, store);
});

// static path for browser to get bundle.js
app.use('/dist', express.static(path.join(__dirname, '..', '..', 'dist')));

app.get('*', function (req, res) {
  res.status(404).end('404 - Page Not Found');
});

app.listen(3000, function () {
  console.log('Listening on port 3000, root: ' + __dirname);
});