// Action Types
// =====================================
// --------------------------------
const REQUEST_GAME =        'REQUEST_GAME';
const RECEIVE_GAME =        'RECEIVE_GAME';
const GET_LOCAL_GAME =      'GET_LOCAL_GAME';

const CREATE_ITEM =         'CREATE_ITEM';
const UPDATE_ITEM =         'UPDATE_ITEM';
const DELETE_ITEM =         'DELETE_ITEM';
const ADD_SETTING =         'ADD_SETTING';
const UPDATE_GAME =         'UPDATE_GAME';

const BEGIN_SAVE_CORE =     'BEGIN_SAVE_CORE';
const END_SAVE_CORE =       'END_SAVE_CORE';

const CATEGORIES = {
    TAGS:           'Tags',
    RULES:          'Rules',
    DEFINITIONS:    'Definitions'
};

const coreActions = {

    // Constants
    // =====================================
    // --------------------------------
    api: {
        FETCH_CORE: '/Core/Get',
        SAVE_CORE:  '/Core/Save'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestGame:    function()      { return { type: REQUEST_GAME }},
    receiveGame:    function(game)  { return { type: RECEIVE_GAME, game }},
    getLocalGame:   function(id)    { return { type: GET_LOCAL_GAME, id}},
    fetchGame:      function(id){
        return dispatch => {
            // Show loading indication.
            dispatch(this.requestGame());

            // Fetch games from database with state filters.
            $.get(this.api.FETCH_CORE, { id })
                .fail(response => dispatch(this.getLocalGame(id)))
                .done(response => {
                    const result = JSON.parse(response)
                    dispatch(this.receiveGame(result))
                });
        }
    },

    // --------------------------------
    createItem: function(tab) {
        return (dispatch, getState) => {
            const { designer, core } = getState();
            const category = tab || designer.tab;
            dispatch({ 
                type: CREATE_ITEM,
                index: core[category].length,
                category
            });
        }
    },

    // --------------------------------
    addSetting: function(index, setting){
        return { type: ADD_SETTING, index, setting };
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

            dispatch({ type: UPDATE_ITEM, category, index, model, saved, fromCore });
        }
    },

    // --------------------------------
    updateGame: function(model){
        return { type: UPDATE_GAME, model };
    },

    // --------------------------------
    save: function(){
        return (dispatch, getState) => {

            dispatch({ type: BEGIN_SAVE_CORE });

            const { core } = getState();

            // Fetch games from database with state filters.
            $.get(this.api.SAVE_CORE, core)
                //.fail(response => dispatch(this.getLocalGame(id)))
                .done(r => dispatch({ type: END_SAVE_CORE }));
        };
    }
}

