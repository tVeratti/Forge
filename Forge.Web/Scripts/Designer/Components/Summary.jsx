const React = require('react');
const { connect} = require('react-redux');
const moment = require('moment');

const Button = require('Common/Components/Button.jsx');

// Presentation
// =====================================
const __Summary = React.createClass({
    render: function(){
        const { Game } = this.props.core;
        const { loading } = this.props.designer; 

        const createdAgo = moment.utc(Game.CreatedDate).fromNow();
        
        return (
            <div className='section section--summary designer__summary'>

                {/* Game Information */}
                <h1>{Game.Name || (loading && 'Loading...') || '\u00A0'} </h1>
                <p><b>{Game.CreatedByUserName}</b> {createdAgo}</p>

                <div className='separator' />

            </div>
        );
    }
});

// Container
// =====================================
const Summary = connect(
    state => { return { ...state } }
)(__Summary);

module.exports = Summary;
