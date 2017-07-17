
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
        return { type: 'REQUEST_GAMES' };
    },

    // --------------------------------
    receiveGames: function(games){
        return { type: 'RECEIVE_GAMES', games };
    },

    // --------------------------------
    fetchGames: function() {
        return (dispatch, getState) => {
            // Show loading indication.
            dispatch(this.requestGames());

            // Get the current filters from store state.
            const filters = getState().library.filters;

            // Fetch games from database with state filters.
            fetch(this.api.FETCH_GAMES, { 
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ filters })
                })
                .then(response => response.json())
                .then(result => dispatch(this.receiveGames(result)));

        }
    },

    // --------------------------------
    createGame: function(name) {
        return dispatch => {
            // Show loading indication.
            dispatch(this.requestGames());

            // Create game and retrieve a new list of games
            // (including the newly created one)
            fetch(this.api.CREATE_GAME, { 
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name })
                })
                .then(response => response.json())
                .then(result => dispatch(this.receiveGames(result)));
        };
    },

    // --------------------------------
    deleteGame: function(id) {
        return dispatch => { 
            fetch(this.api.DELETE_GAME, { 
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id })
                })
                .then(response => response.json())
                .then(result => dispatch(this.receiveGames(result)));
        };
    },

    // --------------------------------
    filterGames: function(key, value){
        return dispatch => {
            // Update store filters.
            dispatch({ type: 'FILTER_GAMES', key, value });

            // Fetch games with new filters.
            dispatch(this.fetchGames());
        }
    }
}

module.exports = libraryActions;