const React = require('react');
const { Provider, connect} = require('react-redux');

const store =               require('Store.js');
const designerActions =     require('Designer/Actions.js');
const coreActions =         require('Core').actions;

const Summary =     require('./Designer__Summary.jsx');
const Tabs =        require('./Designer__Tabs.jsx');
const Dialogs =     require('./Designer__Dialogs.jsx');
const List =        require('./Designer__List.jsx');
const Stage =       require('./Designer__Stage.jsx');

// -------------------------------------------------
// <Designer />
// 
// =====================
// |         a         |
// |         b         |
// =====================
// | 1 |     2         |
// |   |               |
// |   |               |
// =====================
// a: Designer.Summary
// b: Designer.Tabs
// 1: Designer.List
// 2: Designer.Stage
//
// --------------------------------------------------
// =====================================
// Presentation
// =====================================
const __Designer = React.createClass({
    // -----------------------------
    render: function () {
        const { designer, dispatch } = this.props;
        const loading = designer.saving || designer.loading;

        let className = 'designer';        
        if (loading) className += ' designer--loading';

        const closeList = () => dispatch(designerActions.closeList());

        return (
            <div className={className}>
                <Dialogs />

                {/* Game Information & Navigation */}
                <div className='section section--secondary'>
                    {loading && <div className='loading-bar' />}
                    
                    <Summary />
                    <Tabs />
                </div>

                {/* Stage & Controls */}
                <div className='designer__views'>
                    <List />
                    <Stage />
                </div>

            </div>
        );
    },

    // -----------------------------
    componentWillMount: function(){
        // Model comes from C# -
        // Set data into store with dispatch.
        const { dispatch, id } = this.props;
        dispatch(coreActions.fetchGame(id));
    },

    // -----------------------------
    componentWillReceiveProps: function(nextProps){
        const game = nextProps.core.Game;
        if (game && game.Name) document.title = `${game.Name} - Forge | Designer`;
    }
});

// =====================================
// Container
// =====================================
const Designer = connect(
    state => { return { ...state } }
)(__Designer);

// =====================================
// Root
// =====================================
Designer.Provider = (props) => (
    <Provider store={store}>
        <Designer {...props} />
    </Provider>
);

module.exports = Designer;
