// Action Types
// =====================================
// --------------------------------
const REQUEST_GAME =        'REQUEST_GAME';
const RECEIVE_GAME =        'RECEIVE_GAME';
const GET_LOCAL_GAME =      'GET_LOCAL_GAME';
const CREATE_ITEM =         'CREATE_ITEM';
const UPDATE_ITEM =         'UPDATE_ITEM';
const DELETE_ITEM =         'DELETE_ITEM';

const UPDATE_DEFINITION =   'UPDATE_DEFINITION';
const ADD_SETTING =         'ADD_SETTING';

const UPDATE_RULE =         'UPDATE_RULE';
const UPDATE_TAG =          'UPDATE_TAG';

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
        FETCH_GAME: '/Core/Get'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestGame:    function()      { return { type: REQUEST_GAME }},
    receiveGame:    function(game)  { return { type: RECEIVE_GAME, game }},
    getLocalGame:   function(id)    { return { type: GET_LOCAL_GAME, id}},

    // --------------------------------
    fetchGame: function(id){
        return dispatch => {
            // Show loading indication.
            dispatch(this.requestGame());

            // Fetch games from database with state filters.
            $.get(this.api.FETCH_GAME, { id })
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
        saved = fromCore ? !model.unsaved : saved;

        return (dispatch, getState) => {
            const { designer, core } = getState();
            let index = designer.index === -1
                ? model.index
                : designer.index;

            dispatch({ type: UPDATE_ITEM, category, index, model, saved, fromCore });
        }
    }
}

