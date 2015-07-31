import * as CounterActions from './actions/CounterActions';

const list = [];

Object.keys(CounterActions).sort().forEach(key => {
  const actionCreator = CounterActions[key];
  if( typeof actionCreator === 'function' ) {
    list.push(actionCreator);
  }
});

export default list;
