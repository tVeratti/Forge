const React = require('react');
const { connect} = require('react-redux');

const libraryActions = require('Library/Actions.js');
const Game = require('./Game.jsx');

// Presentation
// =====================================
const __List = React.createClass({
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
            return <Game key={game.Id} {...game} />;
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
const List = connect(
    state => { return { ...state.library } }
)(__List);

module.exports = List;
