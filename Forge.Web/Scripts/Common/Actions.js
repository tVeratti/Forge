// Action Creators
// =====================================
const actions = {
    // --------------------------------
    openDialog: function(dialogType){
        return { type: 'OPEN_DIALOG', dialogType }
    },
    
    // --------------------------------
    closeDialog: function(){
        return { type: 'CLOSE_DIALOG' };
    }
}

module.exports = actions;