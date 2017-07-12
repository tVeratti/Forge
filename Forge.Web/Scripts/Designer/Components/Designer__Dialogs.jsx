const React = require('react');
const { connect} = require('react-redux');

const actions = require('Designer/Actions.js');

const LoadError =   require('./Dialogs/Designer__LoadError.jsx');
const Groups =      require('./Dialogs/Designer__Groups.jsx');

// Presentation
// =====================================
const __Dialogs = (props) => {
    const { dialogType } = props;

    const { 
        LOAD_ERROR,
        LOAD_CONFLICT,
        EDIT_GROUPS
        } = actions.dialogTypes;

    switch (dialogType) {
        case LOAD_ERROR:    return <LoadError />;
        case EDIT_GROUPS:   return <Groups />;
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

// Container
// =====================================
const Dialogs = connect(
    state => { 
        return { dialogType: state.common.dialogType }
    }
)(__Dialogs);

module.exports = Dialogs;
