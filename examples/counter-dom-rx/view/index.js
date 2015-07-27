import {Rx} from 'rx-redux'
import * as CounterActions from '../actions/CounterActions'

const render = (() => {
  const counter = document.getElementById('count');

  return (state) => {
    console.log('render UI with state:', state);
    counter.textContent = state.counter.toString();
  }
})();

function domEventToActionStream(id, event, actionCreator) {
  const element = document.getElementById(id);
  const event$ = Rx.Observable.fromEvent(element, event);
  return event$.map(actionCreator);
}

function getActionStream() {
  const decreaseAction$ = domEventToActionStream('btn-decrease', 'click', CounterActions.decrement);
  const increaseAction$ = domEventToActionStream('btn-increase', 'click', CounterActions.increment);
  const increaseIfOddAction$ = domEventToActionStream('btn-odd', 'click', CounterActions.incrementIfOdd);
  const increaseAsyncAction$ = domEventToActionStream('btn-async', 'click', CounterActions.incrementAsync);

  return Rx.Observable.merge(decreaseAction$, increaseAction$, increaseIfOddAction$, increaseAsyncAction$);
}

export default {
  render,
  getActionStream
};
