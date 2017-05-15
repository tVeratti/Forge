// -------------------------------------------------
// <Designer.Summary />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Summary = React.createClass({
    render: function(){
        var game = this.props.Game;
        var createdAgo = moment.utc(game.CreatedDate).fromNow();
        
        return (
            <div className='section section--summary designer__summary'>

                { this.props.loading && <h2>Loading...</h2> }

                {/* Game Information */}
                <h1>{game.Name || '\u00A0'}</h1>
                <p><b>{game.CreatedByUserName}</b> {createdAgo}</p>

                <div className='separator' />

            </div>
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Summary = connect(
    state => { return { ...state.core} }
)(Designer.__Summary);
