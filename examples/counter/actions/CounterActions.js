import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

export function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementTimeout() {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}

export function incrementPromise() {
  function getRandomTime() { return Math.floor(Math.random()*10%5)*100+800; }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(increment());
    }, getRandomTime());
  });
}
