const { actions, CATEGORIES} = require('Core');

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
    back: function(){
        return { type: 'BACK' };
    },

    // --------------------------------
    changeTab: function(tab){
        return { type: 'CHANGE_TAB', tab };
    },

    // --------------------------------
    selectListItem: function(index){
        return { type: 'SELECT_LIST_ITEM', index };
    },

    // --------------------------------
    navigate: function(model){
        return { type: 'SELECT_LIST_ITEM', category: model.Category, index: model.index };
    },

    // --------------------------------
    closeList: function(){
        return { type: 'FORCE_LIST', listOpen: false, force: true };
    },

    // --------------------------------
    openList: function(listTab){
        return { type: 'FORCE_LIST', listOpen: true, listTab, force: true};
    },

    // --------------------------------
    activateTag: function(tagId){
        return { type: 'ACTIVATE_TAG', tagId };
    },

    // --------------------------------
    delete: function(){
        return (dispatch, getState) => {

            // Get the current state data.
            const { core, designer } = getState();
            const { tab, index } = designer;
            const gameId = core.Game.Id;
            const model = { ...core[tab][index] };

            dispatch({ type: 'DELETE_ITEM', model, tab });

            let api;
            switch(designer.tab){
                case CATEGORIES.TAGS: api = this.api.DELETE_TAG; break;
                case CATEGORIES.RULES: api = this.api.DELETE_RULE; break;
                case CATEGORIES.DEFINITIONS: api = this.api.DELETE_DEFINITION; break;
            }

            fetch(api, { 
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: model.Id })
            });
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
            fetch(api, { 
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ model })
                })
                //.fail(response => dispatch(actions.updateItem(model, tab, true)))
                .then(response => response.json())
                .then(id => {
                    // Check if an id was sent back from the controller -
                    // this indicates if an item was inserted or updated.
                    if (id){
                        // A new item was created, so we need
                        // to capture the new Id and update the model.
                        model.Id = id;
                    }
                    
                    dispatch(actions.updateItem(model, tab, true));
                });
        }
        
        return debounceAction(thunk, 'saveModel', 500);
    }
}

module.exports = designerActions;