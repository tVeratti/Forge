// =====================================
// Presentation
// =====================================
Library.__Controls = React.createClass({
    // --------------------------------
    render: function(){

        return (
            <div className='library__controls'>
                <Library.Filters />

                
            </div>
        );
    }

    
});

// =====================================
// Container
// =====================================
Library.Controls = connect()(Library.__Controls);
