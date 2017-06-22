// Action Types
// =====================================
// --------------------------------
const REQUEST_GAMES =   'REQUEST_GAMES';
const RECEIVE_GAMES =   'RECEIVE_GAMES';
const CREATE_GAME =     'CREATE_GAME';
const DELETE_GAME =     'DELETE_GAME';
const FILTER_GAMES =    'FILTER_GAMES';

const libraryActions = {    

    // Constants
    // =====================================
    // --------------------------------
    filterTypes: {
        PERMISSION:     'Permission',
        KEYWORD:        'Keyword',
        GENRE:          'Genre'
    },

    filters: {
        SHOW_PUBLIC:    'SHOW_PUBLIC',
        SHOW_SHARED:    'SHOW_SHARED',
        SHOW_MINE:      'SHOW_MINE'
    },

    api: {
        FETCH_GAMES:    '/Games/GetGames',
        CREATE_GAME:    '/Games/CreateGame',
        DELETE_GAME:    '/Games/DeleteGame/'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestGames: function(){
        return { type: REQUEST_GAMES };
    },

    // --------------------------------
    receiveGames: function(games){
        return { type: RECEIVE_GAMES, games };
    },

    // --------------------------------
    fetchGames: function() {
        const thunk = (dispatch, getState) => {
            // Show loading indication.
            dispatch(this.requestGames());

            // Get the current filters from store state.
            const filters = getState().library.filters;

            // Fetch games from database with state filters.
            $.post(this.api.FETCH_GAMES, filters)
                .then(response => JSON.parse(response))
                .then(result => dispatch(this.receiveGames(result)));

        }
        
        return debounceAction(thunk, 'fetchGames', 500);
    },

    // --------------------------------
    createGame: function(name) {
        return dispatch => {
            // Show loading indication.
            dispatch(this.requestGames());

            // Create game and retrieve a new list of games
            // (including the newly created one)
            $.post(this.api.CREATE_GAME, {name})
                .then(response => JSON.parse(response))
                .then(result => dispatch(this.receiveGames(result)));
        };
    },

    // --------------------------------
    deleteGame: function(id) {
        return dispatch => { 
            $.post(api.DELETE_GAME, id)
                .then(response => JSON.parse(response))
                .then(result => dispatch(this.receiveGames(result)));
        };
    },

    // --------------------------------
    filterGames: function(key, value){
        return dispatch => {
            // Update store filters.
            dispatch({ type: FILTER_GAMES, key, value });

            // Fetch games with new filters.
            dispatch(this.fetchGames());
        }
    }
}