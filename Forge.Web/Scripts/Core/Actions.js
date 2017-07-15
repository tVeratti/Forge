require('whatwg-fetch');

const CATEGORIES = {
    TAGS:           'Tags',
    RULES:          'Rules',
    DEFINITIONS:    'Definitions'
};

const actions = {

    // Constants
    // =====================================
    // --------------------------------
    api: {
        FETCH_CORE:         '/Core/Get',
        SAVE_CORE:          '/Core/Save',
        SAVE_RULE:          '/Core/SaveRule',
        SAVE_TAG:           '/Core/SaveTag',
        SAVE_DEFINITION:    '/Core/SaveDefinition',
        SAVE_GROUPS:         '/Core/SaveGroups'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestGame:    function()      { return { type: 'REQUEST_GAME' }},
    receiveGame:    function(game)  { return { type: 'RECEIVE_GAME', game }},
    getLocalGame:   function(id)    { return { type: 'GET_LOCAL_GAME', id}},
    fetchGame:      function(id)    {
        return dispatch => {
            // Show loading indication.
            dispatch(this.requestGame());

            // Fetch games from database with state filters.
            fetch(`${this.api.FETCH_CORE}/${id}`, { credentials: 'same-origin' })
                //.fail(response => dispatch(this.getLocalGame(id)))
                .then(response => response.json())
                .then(response => dispatch(this.receiveGame(response)));
        }
    },

    // --------------------------------
    updateItemId: function(oldId, newId, tab){
        return { type: 'UPDATE_ID', oldId, newId, tab };
    },

    // --------------------------------
    createItem: function(tab, model = {}){
        return (dispatch, getState) => {

            // Get the current state data.
            const { core, designer } = getState();
            const gameId = core.Game.Id;
            const category = tab || designer.tab;

            const tempId = `tempId-${Math.random()}`;
            model.GameId = gameId;

            let api;
            switch(category){
                case CATEGORIES.TAGS: api = this.api.SAVE_TAG; break;
                case CATEGORIES.RULES: api = this.api.SAVE_RULE; break;
                case CATEGORIES.DEFINITIONS: api = this.api.SAVE_DEFINITION; break;
            }

            // Create item locally before DB insert.
            dispatch({ 
                 type: 'CREATE_ITEM',
                 id: tempId,
                 index: core[category].length,
                 category
            });
            
            // Send model data to database.
            fetch(api, { 
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ model, gameId })
                })
                //.fail(response => dispatch(coreActions.updateItem(model, tab, true)))
                .then(response => response.json())
                .then(id => dispatch(this.updateItemId(tempId, id, category)));
        }
    },

    // --------------------------------
    updateGroups: function(groups){
        return (dispatch, getState) => {
            const { core, designer } = getState();
            const gameId = core.Game.Id;

            fetch(this.api.SAVE_GROUPS, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ groups, gameId })
                })
                .then(response => response.json())
                .then(result => dispatch({ type: 'UPDATE_GROUPS', result }));
        }
    },

    // --------------------------------
    addSetting: function(index, setting){
        return { type: 'ADD_SETTING', index, setting };
    },

    // --------------------------------
    updateTag: function(model){
        return this.updateItem(model, CATEGORIES.TAGS);
    },

    // --------------------------------
    updateRule: function(model){
        return this.updateItem(model, CATEGORIES.RULES);
    },

    // --------------------------------
    updateDefinition: function(model, fromCore){
        return this.updateItem(model, CATEGORIES.DEFINITIONS, false, fromCore);
    },

    // --------------------------------
    updateItem: function(model, category, saved, fromCore){
        // 'fromCore' is true only from the Forge.Definition component itself,
        // meaning that this update came from user input on the Builder,
        // not from editing the Designer.
        saved = fromCore ? !model.unsaved : saved;

        return (dispatch, getState) => {
            const { designer, core } = getState();
            let index = designer.index === -1
                ? model.index
                : designer.index;

            dispatch({ type: 'UPDATE_ITEM', category, index, model, saved, fromCore });
        }
    },

    // --------------------------------
    updateGame: function(model){
        return { type: 'UPDATE_GAME', model };
    },

    // --------------------------------
    save: function(){
        return (dispatch, getState) => {

            dispatch({ type: 'BEGIN_SAVE_CORE' });

            const { core } = getState();

            // Fetch games from database with state filters.
            fetch(this.api.SAVE_CORE, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ core })
                })
                //.fail(response => dispatch(this.getLocalGame(id)))
                .then(r => dispatch({ type: 'END_SAVE_CORE' }));
        };
    }
}

module.exports = {
    actions,
    CATEGORIES
};

