function pickReducer(reducers) {
  return Object.keys(reducers).reduce((result, key) => {
    if (typeof reducers[key] === 'function') {
      result[key] = reducers[key];
    }

    return result;
  }, {});
}

export default function combineReducers(reducers) {
  const finalReducers = pickReducer(reducers);
  const keys = Object.keys(finalReducers);

  return (state = {}, action = undefined) => {
    return keys.reduce((result, key) => {
      result[key] = finalReducers[key](state[key], action);
      return result;
    }, {});
  };
}
