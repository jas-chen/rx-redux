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

    return (state, action) => {
        for(var name in reducers) {
            state[name] = reducers[name](state[name], action);
        }

        return state
    }
}