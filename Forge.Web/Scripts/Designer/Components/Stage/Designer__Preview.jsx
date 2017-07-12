const React = require('react');
const { connect} = require('react-redux');

// Presentation
// =====================================
const __Preview = React.createClass({
    // -----------------------------
    render: function() {
        return (
            <div className='designer__preview'>
                <Builder.Groups />
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
