// -------------------------------------------------
// <Designer.Summary />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Summary = React.createClass({
    render: function(){
        const { Game } = this.props.core;
        const { loading } = this.props.designer; 

        const createdAgo = moment.utc(Game.CreatedDate).fromNow();
        
        return (
            <div className='section section--summary designer__summary'>

                {/* Game Information */}
                <h1>{Game.Name || (loading && 'Loading...') || '\u00A0'}</h1>
                <p><b>{Game.CreatedByUserName}</b> {createdAgo}</p>

                <div className='separator' />

            </div>
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Summary = connect(
    state => { return { ...state } }
)(Designer.__Summary);
