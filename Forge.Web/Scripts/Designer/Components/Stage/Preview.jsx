const React = require('react');
const { connect} = require('react-redux');

const Groups = require('Builder/Components/Groups.jsx');

// Presentation
// =====================================
const __Preview = React.createClass({
    // -----------------------------
    render: function() {
        return (
            <div className='designer__preview'>
                <Groups />
            </div>
        );
    }
});

// Container
// =====================================
const Preview = connect(
    state => { return { ...state }}
)(__Preview);

module.exports = Preview;
