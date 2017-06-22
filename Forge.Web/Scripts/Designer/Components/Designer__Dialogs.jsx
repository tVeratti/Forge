// =====================================
// Presentation
// =====================================
Designer.__Dialogs = React.createClass({
    render: function(){
        const { dialogType } = this.props.common;
        const { conflict } = this.props.core;
        const { local } = this.props.designer;

        const { 
            LOAD_ERROR,
            LOAD_CONFLICT
         } = designerActions.dialogTypes;

        let dialogProps;
        switch (true) {
            case dialogType == LOAD_ERROR: dialogProps = this.getLoadErrorProps(); break;
            case !!conflict: dialogProps = this.getLoadConflictProps(); break; 
        }
        
        return (
            <div className='designer__dialogs'>
                {dialogProps && <Dialog {...dialogProps} />}
            </div>
        );
    },

    // -----------------------------
    getLoadErrorProps: function(){
        return {
            header: 'Connection Failed',
            children: 'The Designer could not be loaded. You may continue working in offline mode, but your changes will not be committed to the database until your connection resumes.'
        }
    },

    // -----------------------------
    getLoadConflictProps: function(){
        const { Game, conflict } = this.props.core;
        
        return {
            header: 'Conflicting Designer Data',
            children: (
                <div>
                    The Designer data retrieved from the database does not match your local version. Please choose which version of the Designer you wish to keep.
                    <p>Local: {Game.UpdatedDate}, {Game.UpdatedByUserName}</p>
                    <p>Last Saved: {conflict.UpdatedDate}, {conflict.UpdatedByUserName}</p>
                </div>
            ),
            buttons: [
                <button>Local</button>,
                <button>Last Saved</button>
            ]
        }
    },
});

// =====================================
// Container
// =====================================
Designer.Dialogs = connect(
    state => { return { ...state }}
)(Designer.__Dialogs);
