const initialLibraryState = {
    games: [],
    filters: {
        Permission: 'SHOW_PUBLIC'
    }
}

function libraryReducer(state = initialLibraryState, action){

    const nextState = { ...state };

    switch(action.type){
        // --------------------------------
        case REQUEST_GAMES:
            nextState.isLoading = true;
            break;

        // --------------------------------
        case RECEIVE_GAMES:
            nextState.games = action.games;
            nextState.isLoading = false;
            break;

        // --------------------------------
        case FILTER_GAMES:
            const filters = { ...nextState.filters };
            filters[action.key] = action.value;
            nextState.filters = filters;
            break;
    }
    
    return nextState;
}