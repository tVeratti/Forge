const initialState = {
    user: {}
}

function reducer(state = initialState, action){

    let nextState = Object.assign({}, state);

    switch(action.type){
        // --------------------------------
        case 'SET_USER':
            nextState.user = { ...action };
            delete nextState.user.type;
            
            break;
        // --------------------------------
        case 'REQUEST_USER':
            break;

        // --------------------------------
        case 'RECEIVE_USER':
            break;
    }
    
    return nextState;
}

module.exports = reducer;