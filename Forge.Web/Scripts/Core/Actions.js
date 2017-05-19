// Action Types
// =====================================
// --------------------------------
const REQUEST_GAME =        'REQUEST_GAME';
const RECEIVE_GAME =        'RECEIVE_GAME';
const CREATE_ITEM =         'CREATE_ITEM';
const UPDATE_ITEM =         'UPDATE_ITEM';

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
    requestGame: function()      { return { type: REQUEST_GAME }},
    receiveGame: function(game)  { return { type: RECEIVE_GAME, game }},

    // --------------------------------
    fetchGame: function(id){
        return dispatch => {
            // Show loading indication.
            dispatch(this.requestGame());

            // Fetch games from database with state filters.
            $.get(this.api.FETCH_GAME, { id })
                .then(response => JSON.parse(response))
                .then(result => dispatch(this.receiveGame(result)));
        }
    },

    // --------------------------------
    createItem: function() {
        return (dispatch, getState) => {
            const { designer, core } = getState();
            dispatch({ 
                type: CREATE_ITEM,
                category: designer.tab,
                index: core[designer.tab].length
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
    updateDefinition: function(model){
        return this.updateItem(model, CATEGORIES.DEFINITIONS);
    },

    // --------------------------------
    updateItem: function(model, category){
        return (dispatch, getState) => {
            const { designer, core } = getState();
            let index = designer.index === -1
                ? model.index
                : designer.index;

            dispatch({ type: UPDATE_ITEM, category, index, model });
        }
    }
}

