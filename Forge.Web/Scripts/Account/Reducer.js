const initialState = {
    dialogType: null
}

function commonReducer(state = initialState, action){

    let nextState = Object.assign({}, state);

    switch(action.type){
        case 'GET_LOCAL_GAME':
            nextState.dialogType = designerActions.dialogTypes.LOAD_ERROR;
            break;

        // --------------------------------
        case 'OPEN_DIALOG':
            nextState.dialogType = action.dialogType;
            break;

        // --------------------------------
        case 'CLOSE_DIALOG':
            nextState.dialogType = null;
            break;
    }
    
    return nextState;
}

module.exports = commonReducer;