import fs from 'fs';
import express from 'express';
import path from 'path';
import { createStore } from 'rx-redux';
import { reducer, applyRxMiddleware } from '../shared';
import getActionStream from './utils/getActionStream';

var app = express();

app.use('/dist', express.static(path.join(__dirname, '..', '..', 'dist')));

const index = fs.readFileSync('./src/server/index.html', {encoding: 'utf-8'});

app.get('/', function (req, res) {
  console.log(req.query.action);


  const store = createStore(reducer);

  // stream states to view
  store.state$.subscribe(
    state => console.log(state),
    err => { throw new Error(err); },
    () => {
      console.log('completed');
      res.send(index.replace('${counter}', store.getState().counter).replace('${state}', JSON.stringify(store.getState())));
    }
  );

  const action$ = getActionStream(req.query);

  // stream actions to dispatcher
  applyRxMiddleware(action$, store).subscribe(
    action => store.dispatcher$.onNext(action),
    err => { throw new Error(err); },
    () => {
      store.dispatcher$.onCompleted();
    }
  );
});

app.get('*', function (req, res) {
  res.status(404).end('404 - Page Not Found');
});

app.listen(3000, function () {
  console.log('Listening on port 3000, root: ' + __dirname);
});