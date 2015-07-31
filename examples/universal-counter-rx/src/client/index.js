import { createStore } from 'rx-redux';
import { reducer, applyRxMiddleware } from '../shared';
import { render, getActionStream } from './view';


const store = window.__state ? createStore(reducer, window.__state): createStore(reducer);

// stream states to view
store.state$.skip(window.__state ? 1 : 0).subscribe(state => render(state));

const action$ = getActionStream();

// stream actions to dispatcher
applyRxMiddleware(action$, store).subscribe(action => store.dispatcher$.onNext(action));