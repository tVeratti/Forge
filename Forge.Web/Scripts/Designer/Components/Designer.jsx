// -------------------------------------------------
// <Designer />
// 
// =====================
// |       a   b       |
// =====================
// | 1 |     2     | x |
// |   |           |   |
// |   |           |   |
// =====================
// a: Designer.Summary
// b: Designer.Tabs
// 1: Designer.Definitions
// 2: Designer.Stage
// 3: Designer.Settings
//
// --------------------------------------------------
// =====================================
// Presentation
// =====================================
const __Designer = React.createClass({
    // -----------------------------
    render: function () {
        const { designer } = this.props;
        const loading = designer.saving || designer.loading;

        let className = 'designer';        
        if (loading) className += ' designer--loading';

        return (
            <div className={className}>
                <Designer.Dialogs />

                <div className='section section--secondary'>
                    {loading && <div className='loading-bar' />}
                    
                    {/* Game Information & Navigation */}
                    <Designer.Summary />
                    <Designer.Tabs />
                </div>

                <div className='designer__views overlay__anchor'>
                    {/* Stage & Controls */}
                    <Designer.List />
                    <Designer.Stage />
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
