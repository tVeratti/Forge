const React = require('react');
const { Provider, connect} = require('react-redux');

// =====================================
// Presentation
// =====================================
const __Account = React.createClass({
    // -----------------------------
    render: function () {

        return (
            <div className='account'>


            </div>
        );
    },

    // -----------------------------
    componentWillMount: function(){
        // Model comes from C# -
        // Set data into store with dispatch.
        // const { dispatch, id } = this.props;
        // dispatch(coreActions.fetchGame(id));
    },

    // -----------------------------
    componentWillReceiveProps: function(nextProps){
        // const game = nextProps.Game;
        // if (game && game.Name) document.title = `${game.Name} - Forge | Builder`;
    }
});

// =====================================
// Container
// =====================================
const Account = connect(
    state => { return { ...state.core } }
)(__Account);

// =====================================
// Root
// =====================================
Account.Provider = (props) => (
    <Provider store={store}>
        <Account {...props} />
    </Provider>
);

module.exports = Account;