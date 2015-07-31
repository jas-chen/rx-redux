import { INCREMENT_COUNTER, DECREMENT_COUNTER, INCREMENT_DELAY, DUMMY_ACTION } from '../constants/ActionTypes';

export function increment() {
  return {
    type: INCREMENT_COUNTER,
    creator: increment
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER,
    creator: decrement
  };
}

export function incrementIfOdd() {
  return (getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return {
        type: DUMMY_ACTION,
        creator: incrementIfOdd
      };
    }

    return {
      type: INCREMENT_COUNTER,
      creator: incrementIfOdd
    };
  };
}

export function incrementTimeout() {
  return {
    type: INCREMENT_DELAY,
    payload: {
      action: {
        type: INCREMENT_COUNTER,
        creator: incrementTimeout
      },
      time: 1000
    },
    creator: incrementTimeout
  };
}

export function incrementPromise() {
  function getRandomTime() { return Math.floor(Math.random()*10%5)*100+800; }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        type: INCREMENT_COUNTER,
        creator: incrementPromise
      });
    }, getRandomTime());
  });
}