// =====================================
// Presentation
// =====================================
Library.__List = React.createClass({
    // --------------------------------
    render: function(){
        const gameNodes = this.renderGames();

        return (
            <ul className='library__list'>
                {gameNodes}
            </ul>
        );
    },

    // --------------------------------
    componentDidMount: function(){
        this.props.dispatch(libraryActions.fetchGames());
    },

    // --------------------------------
    renderGames: function(){
        return this.props.games.map(game => {
            return <Library.Game key={game.Id} {...game} />;
        });
    }
});

// =====================================
// Container
// =====================================
Library.List = connect(
    state => { return { ...state.library } }
)(Library.__List);
