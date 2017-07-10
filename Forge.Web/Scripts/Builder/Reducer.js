const initialState = {
    loading: true,
    saving: false
}

function builderReducer(state = initialState, action){
    
    let nextState = Object.assign({}, state);


    switch(action.type){
        
    }

    return nextState;
}

module.exports = builderReducer;