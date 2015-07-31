import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';
import list from '../actionCreatorList';

export default function queryString(state = '', action = {}) {
  if(!action.creator) {
    return state;
  }

  return state + list.indexOf(action.creator);
}