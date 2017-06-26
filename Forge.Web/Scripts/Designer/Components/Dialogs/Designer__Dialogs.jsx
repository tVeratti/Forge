// =====================================
// Presentation
// =====================================
Designer.__Dialogs = () => {
    const { dialogType } = this.props;

    const { 
        LOAD_ERROR,
        LOAD_CONFLICT,
        EDIT_GROUPS
        } = designerActions.dialogTypes;

    switch (dialogType) {
        case LOAD_ERROR:    return <Designer.LoadError />;
        case EDIT_GROUPS:   return <Designer.Groups />;
    }
    
    return <span />

    // -----------------------------
    // getLoadConflictProps: function(){
    //     const { Game, conflict } = this.props.core;
        
    //     return {
    //         header: 'Conflicting Designer Data',
    //         children: (
    //             <div>
    //                 The Designer data retrieved from the database does not match your local version. Please choose which version of the Designer you wish to keep.
    //                 <p>Local: {Game.UpdatedDate}, {Game.UpdatedByUserName}</p>
    //                 <p>Last Saved: {conflict.UpdatedDate}, {conflict.UpdatedByUserName}</p>
    //             </div>
    //         ),
    //         buttons: [
    //             <button>Local</button>,
    //             <button>Last Saved</button>
    //         ]
    //     }
    // },
};

// =====================================
// Container
// =====================================
Designer.Dialogs = connect(
    state => { 
        return { dialogType: state.common.dialogType }
    }
)(Designer.__Dialogs);
