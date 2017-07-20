const actions = {    

    // Constants
    // =====================================
    // --------------------------------
    api: {

    },

    // Action Creators
    // =====================================
    // --------------------------------
    setUser: (id, email) => { return { type: 'SET_USER', id, email }},

    // --------------------------------
    requestUser: () => { return { type: 'REQUEST_USER' }},
    receiveUser: () => { return { type: 'RECEIVE_USER' }},
    fetchUser: function(){
        return dispatch => {
            this.requestUser();
            this.receiveUser();
        }
    }

}

module.exports = actions;