﻿// -------------------------------------------------
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
                <Designer.Dialogs />

                {/* Game Information & Navigation */}
                <div className='section section--secondary'>
                    {loading && <div className='loading-bar' />}
                    
                    <Designer.Summary />
                    <Designer.Tabs />
                </div>

                {/* Stage & Controls */}
                <div className='designer__views'>
                    <Designer.List />
                    <Designer.Stage />
                    <div className='designer__overlay overlay' onClick={closeList} />
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
