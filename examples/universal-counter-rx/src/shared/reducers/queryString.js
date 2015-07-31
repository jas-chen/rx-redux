import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';
import actionId from '../actionId';

export default function queryString(state = '', action = {}) {
  if(!action.creator) {
    return state;
  }

  return state + actionId.indexOf(action.creator);
}