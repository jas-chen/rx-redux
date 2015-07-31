import { INCREMENT_DELAY } from '../constants/ActionTypes';
import Rx from 'rx';

export default function thunkMiddleware(getState) {
  return action => {
    if(action.type === INCREMENT_DELAY) {
      return Rx.Observable.just(action.payload.action).delay(action.payload.time);
    }

    return Rx.Observable.just(action);
  };
}
