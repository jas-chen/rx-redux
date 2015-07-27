export default function bindActionCreators(actionCreators, dispatch) {
  return Object.keys(actionCreators).reduce((result, key) => {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      result[key] = (...args) => dispatch(actionCreator(...args));
    }

    return result;
  }, {});
}
