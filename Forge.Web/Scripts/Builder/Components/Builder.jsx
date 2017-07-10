const React = require('react');
const { Provider, connect} = require('react-redux');

const Groups = require('./Groups.jsx');
const actions = require('./../Actions.js');

// =====================================
// Presentation
// =====================================
const __Builder = React.createClass({
    // -----------------------------
    render: function () {

        return (
            <div className='builder'>


            </div>
        );
    },

    // -----------------------------
    componentWillMount: function(){
        // Model comes from C# -
        // // Set data into store with dispatch.
        // const { dispatch, id } = this.props;
        // dispatch(coreActions.fetchGame(id));
    },

    // -----------------------------
    componentWillReceiveProps: function(nextProps){
        const game = nextProps.Game;
        if (game && game.Name) document.title = `${game.Name} - Forge | Builder`;
    }
});

// =====================================
// Container
// =====================================
const Builder = connect(
    state => { return { ...state.core } }
)(__Builder);

// =====================================
// Root
// =====================================
Builder.Provider = (props) => (
    <Provider store={store}>
        <Builder {...props} />
    </Provider>
);

module.exports = Builder;
