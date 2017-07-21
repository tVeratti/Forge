const actions = {    

    // Constants
    // =====================================
    // --------------------------------
    api: {

    },

    // Action Creators
    // =====================================
    // --------------------------------
    setUser: (id, email, name) => { return { type: 'SET_USER', id, email, name }},

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