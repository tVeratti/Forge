const initialDesignerState = {
    loading: true,
    saving: false,
    tab: 'Menu',
    listTab: 'List',
    index: -1,
    itemHistory: []
}

function designerReducer(state = initialDesignerState, action){
    
    let nextState = Object.assign({}, state);

    if (action.tab || action.index){
        // Push a new history item for the user to navigate back to.
        nextState.itemHistory = [
            { 
                tab: state.tab,
                index: state.index
            },
            ...state.itemHistory
        ];
    }

    switch(action.type){
        // --------------------------------
        case BACK:
            if (state.itemHistory.length){
                const backState = state.itemHistory[0];
                nextState = Object.assign({}, nextState, backState);
                nextState.itemHistory.shift();
            }
            break;

        // --------------------------------
        case CHANGE_TAB:
            nextState.tab = action.tab;
            nextState.index = -1;
            nextState.activeTagId = null;
            break;

        // --------------------------------
        case SELECT_LIST_ITEM:
        case CREATE_ITEM:
            if (state.saving) return nextState;
            nextState.tab = action.tab || action.category || state.tab;
            nextState.index = action.index;
            nextState.activeTagId = null;
            break;

        // --------------------------------
        case ACTIVATE_TAG:
            nextState.activeTagId = action.tagId;
            break;
        
        // --------------------------------
        case SAVE_MODEL:
            if (state.saving) return nextState;
            nextState.saving = true;
            break;

        case UPDATE_ITEM:
            nextState.saving = false;
    }

    return nextState;
}