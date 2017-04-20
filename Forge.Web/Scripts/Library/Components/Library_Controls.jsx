// =====================================
// Presentation
// =====================================
Library.__Controls = React.createClass({
    // --------------------------------
    render: function(){

        return (
            <div className='library__controls'>
                <Library.Filters />

                <div className='library__create'>
                    <input ref='input' />
                    <button onClick={this.createGame}>Create</button>
                </div>
            </div>
        );
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
Library.Controls = connect()(Library.__Controls);
