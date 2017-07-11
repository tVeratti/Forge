// Action Creators
// =====================================
const commonActions = {
    // --------------------------------
    openDialog: function(dialogType){
        return { type: 'OPEN_DIALOG', dialogType }
    },
    
    // --------------------------------
    closeDialog: function(){
        return { type: 'CLOSE_DIALOG' };
    }
}

module.exports = commonActions;