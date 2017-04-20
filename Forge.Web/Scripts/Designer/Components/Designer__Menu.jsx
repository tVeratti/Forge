// =====================================
// Presentation
// =====================================
Designer._Menu = React.createClass({
    // -----------------------------
    render: function() {

        return (
            <div className='designer__menu'>
                <div>
                    <Checkbox id='show-info' label='Show Tips' />
                </div>
                <button className='designer__tile'>Help</button>
                <button className='designer__tile'>Preview</button>
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
