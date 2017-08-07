const React = require('react');
const { Provider, connect} = require('react-redux');

const store =               require('Store.js');
const designerActions =     require('Designer/Actions.js');
const coreActions =         require('Core').actions;

const Shrinky =     require('Common/Components/Shrinky.jsx');

const Summary =     require('./Summary.jsx');
const Tabs =        require('./Tabs.jsx');
const Actions =     require('./Actions.jsx');
const Dialogs =     require('./Dialogs.jsx');
const List =        require('./List.jsx');
const Stage =       require('./Stage.jsx');

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

                {/* Fixed Shrinky
                    <List /> passed as 'stick' param.
                    This forces it to be based on the position
                    of the Shrinky as it changes size/position. */}
                <Shrinky limit={75} stick={<List />}>

                    <div className='section section--secondary'>
                        {loading && <div className='loading-bar' />}

                        {/* Game Information & Navigation */}
                        <Summary />
                        <Tabs />
                        <Actions />
                    </div>
                    
                </Shrinky>

                <div className='designer__static'>
                    {/* Stage & Controls */}
                    <div className='designer__views'>
                        <Stage />
                    </div>
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
