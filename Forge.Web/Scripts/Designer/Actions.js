// Action Types
// =====================================
// --------------------------------
const REQUEST_DESIGNER =        'REQUEST_DESIGNER';
const RECEIVE_DESIGNER =        'RECEIVE_DESIGNER';
const BACK =                    'BACK';
const CHANGE_TAB =              'CHANGE_TAB';
const NAVIGATE =                'NAVIGATE';
const SELECT_LIST_ITEM =        'SELECT_LIST_ITEM';
const FORCE_LIST =              'FORCE_LIST';
const ACTIVATE_TAG =            'ACTIVATE_TAG';
const SAVE_MODEL =              'SAVE_MODEL';
const SAVE_TAG =                'SAVE_TAG';
const SAVE_DEFINITION =         'SAVE_DEFINITION';

const designerActions = {    

    // Constants
    // =====================================
    // --------------------------------
    api: {
        FETCH_DESIGNER:     '/Designer/GetDesigner',
        SAVE_RULE:          '/Core/SaveRule',
        SAVE_TAG:           '/Core/SaveTag',
        SAVE_DEFINITION:    '/Core/SaveDefinition',
        DELETE_TAG:         '/Core/DeleteTag',
        DELETE_RULE:        '/Core/DeleteRule',
        DELETE_DEFINITION:  '/Core/DeleteDefinition'
    },

    // --------------------------------
    dialogTypes: {
        LOAD_ERROR:     'LOAD_ERROR',
        LOAD_CONFLICT:  'LOAD_CONFLICT',
        EDIT_GROUPS:    'EDIT_GROUPS'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestDesigner: function(){
        return { type: REQUEST_DESIGNER };
    },

    // --------------------------------
    receiveDesigner: function(designer){
        return { type: RECEIVE_DESIGNER, designer };
    },

    // --------------------------------
    fetchDesigner: function(id) {
        return dispatch => {
            // Show loading indication.
            dispatch(this.requestDesigner());

            // Fetch games from database with state filters.
            $.get(this.api.FETCH_DESIGNER, { id })
                .then(response => JSON.parse(response))
                .then(result => dispatch(this.receiveDesigner(result)));
        }
    },

    // --------------------------------
    back: function(){
        return { type: BACK };
    },

    // --------------------------------
    changeTab: function(tab){
        return { type: CHANGE_TAB, tab };
    },

    // --------------------------------
    selectListItem: function(index){
        return { type: SELECT_LIST_ITEM, index };
    },

    // --------------------------------
    navigate: function(model){
        return { type: SELECT_LIST_ITEM, category: model.Category, index: model.index };
    },

    // --------------------------------
    closeList: function(){
        return { type: FORCE_LIST, listOpen: false, force: true };
    },

    // --------------------------------
    openList: function(listTab){
        return { type: FORCE_LIST, listOpen: true, listTab, force: true};
    },

    // --------------------------------
    activateTag: function(tagId){
        return { type: ACTIVATE_TAG, tagId };
    },

    // --------------------------------
    delete: function(){
        return (dispatch, getState) => {

            // Get the current state data.
            const { core, designer } = getState();
            const { tab, index } = designer;
            const gameId = core.Game.Id;
            const model = { ...core[tab][index] };

            dispatch({ type: DELETE_ITEM, model, tab });

            let api;
            switch(designer.tab){
                case CATEGORIES.TAGS: api = this.api.DELETE_TAG; break;
                case CATEGORIES.RULES: api = this.api.DELETE_RULE; break;
                case CATEGORIES.DEFINITIONS: api = this.api.DELETE_DEFINITION; break;
            }

            $.post(api, { Id: model.Id });
        }
    },

    // --------------------------------
    saveModel: function(){
        const thunk = (dispatch, getState) => {

            dispatch({ type: SAVE_MODEL });

            // Get the current state data.
            const { core, designer } = getState();
            const { tab, index } = designer;
            const gameId = core.Game.Id;
            const model = { 
                ...core[tab][index],
                gameId,
             };
            
            let api;
            switch(designer.tab){
                case CATEGORIES.TAGS: api = this.api.SAVE_TAG; break;
                case CATEGORIES.RULES: api = this.api.SAVE_RULE; break;
                case CATEGORIES.DEFINITIONS: api = this.api.SAVE_DEFINITION; break;
            }
            
            // Send model data to database.
            $.post(api, { model })
                .fail(response => dispatch(coreActions.updateItem(model, tab, true)))
                .success(response => JSON.parse(response))
                .then(id => {
                    // Check if an id was sent back from the controller -
                    // this indicates if an item was inserted or updated.
                    if (id){
                        // A new item was created, so we need
                        // to capture the new Id and update the model.
                        model.Id = id;
                    }
                    
                    dispatch(coreActions.updateItem(model, tab, true));
                });
        }
        
        return debounceAction(thunk, 'saveModel', 500);
    }
}