import Rx from '../../../node_modules/rx-lite-joinpatterns/node_modules/rx-lite/rx.lite.min';
import actionId from '../../shared/actionId';

export default function getActionCreators(query) {
  const actions = [];

  if(query.action) {
    query.action.split('').forEach(id => {
      const actionCreator = actionId[id];
      if( typeof actionCreator === 'function') {
        actions.push(actionCreator());
      }
    });
  }

  return Rx.Observable.from(actions);
}