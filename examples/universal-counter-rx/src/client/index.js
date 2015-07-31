import { createStore } from 'rx-redux';
import { reducer, applyRxMiddleware } from '../shared';
import { render, getActionStream } from './view';

const store = window.__state ? createStore(reducer, window.__state): createStore(reducer);

// stream states to view
store.state$.skip(window.__state ? 1 : 0).subscribe(state => render(state));

const action$ = getActionStream();

// stream actions to dispatcher
applyRxMiddleware(action$, store).subscribe(action => store.dispatcher$.onNext(action));

// in case user modify query string to invalid id like '11asdasdas'
if(window.location.search.length && window.location.search !== '?action=' + store.getState().queryString) {
  history.replaceState(null, null, '?action=' + store.getState().queryString);
}
