const React = require('react');
const { connect} = require('react-redux');

const Filters = require('./Filters.jsx');

// Presentation
// =====================================
const __Controls = React.createClass({
    // --------------------------------
    render: function(){

        return (
            <div className='library__controls'>
                <Filters />

                
            </div>
        );
    }

    
});

// Container
// =====================================
const Controls = connect()(__Controls);

module.exports = Controls;
