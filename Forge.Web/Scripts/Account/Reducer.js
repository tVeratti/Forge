const initialCommonState = {
    dialogType: null,

    genres: [{ id: 1, value: 'Fantasy' },{ id: 2, value: 'Sci-Fi'}]
}

function commonReducer(state = initialCommonState, action){
    let nextState = Object.assign({}, state);

    switch(action.type){
        case GET_LOCAL_GAME:
            nextState.dialogType = designerActions.dialogTypes.LOAD_ERROR;
            break;

        // --------------------------------
        case OPEN_DIALOG:
            nextState.dialogType = action.dialogType;
            break;

        // --------------------------------
        case CLOSE_DIALOG:
            nextState.dialogType = null;
            break;
    }
    
    return nextState;
}