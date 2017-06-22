// Action Types
// =====================================
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

// Action Creators
// =====================================
const commonActions = {
    // --------------------------------
    openDialog: function(dialogType){
        return { type: OPEN_DIALOG, dialogType }
    },
    
    // --------------------------------
    closeDialog: function(){
        return { type: CLOSE_DIALOG };
    }
}