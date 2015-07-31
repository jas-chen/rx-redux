import { createStore, connectAction } from 'rx-redux';
import { reducer, applyRxMiddleware } from '../shared';
import { render, getActionStream } from './view';

const store = window.__state ? createStore(reducer, window.__state): createStore(reducer);

// stream states to view, skip first render because server has done that
store.state$.skip(1).subscribe(state => render(state));

const action$ = applyRxMiddleware(getActionStream(), store);

// stream actions to dispatcher
connectAction(action$, store);

// in case user modify query string to invalid id like '11asdasdas'
if(window.location.search.length && window.location.search !== '?action=' + store.getState().queryString) {
  history.replaceState(null, null, '?action=' + store.getState().queryString);
}
