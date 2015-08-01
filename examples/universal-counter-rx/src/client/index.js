import { createStore, connectAction } from 'rx-redux';
import { reducer, applyRxMiddleware } from '../shared';
import { render, getActionStream } from './view';

const store = window.__state ? createStore(reducer, window.__state): createStore(reducer);

// keep current state for render function to compare
let currentState = store.getState();

store.state$.subscribe(nextState => {
  render(currentState, nextState);
  currentState = nextState;
});

const action$ = applyRxMiddleware(getActionStream(), store);

// stream actions to dispatcher
connectAction(action$, store);
