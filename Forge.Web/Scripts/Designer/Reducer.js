// Default navigation information based on 
// potential hash values to allow linking/refreshing.
const hash = (location.hash || '').split('/');
const initialDesignerState = {
    loading: true,
    saving: false,
    tab: (hash[0] || 'Menu').replace('#', ''),
    index: hash[1] || -1,
    listTab: 'List',
    itemHistory: []
}

function designerReducer(state = initialDesignerState, action){
    
    let nextState = Object.assign({}, state);
    nextState.navigated = false;

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
        case GET_LOCAL_GAME:
            nextState.local = true;
        case RECEIVE_GAME:
            nextState.saving = false;
            nextState.loading = false;
            
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
        case FORCE_LIST:
        case SELECT_LIST_ITEM:
        case CREATE_ITEM:

            const listOpen = action.listOpen !== undefined
                ? action.listOpen
                : true;

            const listTab = action.listTab !== undefined
                ? action.listTab
                : 'List';

            const index = action.index !== undefined
                ? action.index
                : state.index;

            nextState = {
                ...nextState,
                listOpen,
                listTab,
                index,
                navigated: action.force || !!action.category,
                tab: action.category || state.tab,
                activeTagId: null,
                saving: false,
                loading: false
            };

            break;

        case DELETE_ITEM:
            nextState.index = -1;
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

    window.location.hash = `${nextState.tab}/${nextState.index}`;

    return nextState;
}