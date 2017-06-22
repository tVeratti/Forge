// =====================================
// Presentation
// =====================================
Library.__List = React.createClass({
    // --------------------------------
    render: function(){
        const gameNodes = this.renderGames();

        return (
            <div className='library__list'>
                <div className='library__create'>
                    <input ref='input' />
                    <button onClick={this.createGame}>Create</button>
                </div>

                {/* Games */}
                <ul>{gameNodes}</ul>
            </div>
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
    },

    // --------------------------------
    createGame: function(){
        const gameInput = this.refs.input;
        this.props.dispatch(libraryActions.createGame(gameInput.value));
        gameInput.value = '';
    }
});

// =====================================
// Container
// =====================================
Library.List = connect(
    state => { return { ...state.library } }
)(Library.__List);
