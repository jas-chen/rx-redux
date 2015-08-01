import Rx from 'rx';
import * as CounterActions from '../../shared/actions/CounterActions';

const {when, fromEvent} = Rx.Observable;

const render = (() => {
  const counterElement = document.getElementById('count');

  return (currentState, nextState) => {
    // not every action change view, eg. `increment if odd`
    if (currentState.counter !== nextState.counter) {
      console.log('render UI.');
      counterElement.textContent = nextState.counter.toString();
    }

    // update query string
    if (nextState.queryString.length) {
      history.replaceState(null, null, '?action=' + nextState.queryString);
    }
  }
})();

function get(id) {
  return document.getElementById(id);
}

function getActionStream() {
  return when(
    fromEvent(get('btn-decrease'), 'click').thenDo(CounterActions.decrement),
    fromEvent(get('btn-increase'), 'click').thenDo(CounterActions.increment),
    fromEvent(get('btn-odd'), 'click').thenDo(CounterActions.incrementIfOdd),
    fromEvent(get('btn-timeout'), 'click').thenDo(CounterActions.incrementTimeout),
    fromEvent(get('btn-promise'), 'click').thenDo(CounterActions.incrementPromise)
  )
}

export default {
  render,
  getActionStream
};
