// =====================================
// Presentation
// =====================================
Designer._Menu = React.createClass({
    // -----------------------------
    render: function() {

        return (
            <div className='designer__menu'>

                <div className='designer__tiles'>
                    <button className='designer__tile'>Help</button>
                    <button className='designer__tile'>Preview</button>
                </div>
            </div>
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Menu = connect(
    state => { return { ...state.designer }}
)(Designer._Menu);
