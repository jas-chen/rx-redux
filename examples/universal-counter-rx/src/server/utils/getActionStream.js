import Rx from '../../../node_modules/rx-lite-joinpatterns/node_modules/rx-lite/rx.lite.min';
import list from '../../shared/actionCreatorList';

// Transform action ids to action
export default function getActionCreators(query) {
  const actions = [];

  if(query.action) {
    query.action.split('').forEach(id => {
      const actionCreator = list[id];

      // in case user modify query string to invalid id like '11asdasdas'
      if( typeof actionCreator === 'function') {
        actions.push(actionCreator());
      }
    });
  }

  return Rx.Observable.from(actions);
}