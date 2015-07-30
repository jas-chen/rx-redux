import Rx from 'rx';
import * as CounterActions from '../actions/CounterActions';

const {when, fromEvent} = Rx.Observable;

const render = (() => {
  const counter = document.getElementById('count');

  return (state) => {
    console.log('render UI with state:', state);
    counter.textContent = state.counter.toString();
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
