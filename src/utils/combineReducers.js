function finalReducers(reducers) {
    return Object.keys(reducers).reduce((result, key) => {
        if(typeof reducers[key] === 'function') {
            result[key] = reducers[key];
        }

        return result;
    }, {})
}

export default function combineReducers(reducers) {
    reducers = finalReducers(reducers);
    const keys = Object.keys(reducers);

    if(!keys || !keys.length) {
        console.warn('[combineReducers] Result is empty.');
    }

    return (state = {}, action = undefined) => {
        return keys.reduce((result, key) => {
            result[key] = reducers[key](state[key], action);
            return result;
        }, {})
    }
}