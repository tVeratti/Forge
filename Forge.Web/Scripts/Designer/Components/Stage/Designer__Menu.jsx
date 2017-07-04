// =====================================
// Presentation
// =====================================
Designer._Menu = React.createClass({
    // -----------------------------
    render: function() {
        const { Game, Tags, Rules, Definitions } = this.props.core;

        const accessTypes = ['Public', 'Private', 'Friends']
            .map(t => { return { Id: t, Name: t }});

        const genres = ['Fantasy', 'Horror']
            .map(g => { return { Id: g, Name: g }});

        const categories = [CATEGORIES.TAGS, CATEGORIES.RULES, CATEGORIES.DEFINITIONS];
        const tileNodes = categories.map(this.renderTile);

        return (
            <div className='designer__menu'>
                {/*<div className='designer__tiles'>
                    {tileNodes}
                </div>*/}

                <div className='panel '>
                    <h4>Game Settings</h4>

                    <div className='field-group'>
                        <Field label='Id'>{Game.Id}</Field>
                        <div className='separator separator--small' />

                        <Field label='Name' 
                            id='name'
                            value={Game.Name} />

                        <Field label='Access' 
                            id='access'
                            defaultValue={1}
                            options={accessTypes} />

                        <Field label='Genre' 
                            id='genre'
                            defaultValue={1}
                            options={genres} />
                    </div>
                </div>

                

                <Designer.Recent />
            </div>
        );
    },

    // -----------------------------
    renderTile: function(category){
        const { core, dispatch } = this.props;
        const count = core[category].length;
        const onClick = () => dispatch(designerActions.changeTab(category));

        return (
            <button className='designer__tile' onClick={onClick}>
                <p className='designer__tile-title'>{count}</p>
                <p>{category}</p>
            </button>
        )
    }
});

// =====================================
// Container
// =====================================
Designer.Menu = connect(
    state => { return { ...state }}
)(Designer._Menu);
