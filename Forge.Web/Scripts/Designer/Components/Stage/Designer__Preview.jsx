// =====================================
// Presentation
// =====================================
Designer.__Preview = React.createClass({
    // -----------------------------
    render: function() {
        return (
            <div className='designer__preview'>
                <Builder.Groups />
            </div>
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Preview = connect(
    state => { return { ...state }}
)(Designer.__Preview);
