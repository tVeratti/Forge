const React = require('react');
const { connect} = require('react-redux');

const actions = require('Designer/Actions.js');
const { CATEGORIES } = require('Core');

const Field = require('Common/Components/Field.jsx');
const Select = require('Common/Components/Select.jsx');
const Recent = require('./Designer__Recent.jsx');

// Presentation
// =====================================
const __Menu = React.createClass({
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

                        <Field label='View Access' 
                            id='view-access'
                            defaultValue={1}
                            options={accessTypes} />

                        <Field label='Edit Access' 
                            id='edit-access'
                            defaultValue={1}
                            options={accessTypes} />

                        {/* Genre Tags */}
                        <Field label='Genre' 
                            id='genre'
                            defaultValue={1}
                            options={genres}>
                            <Forge.Tags options={genres} tags={Game.GenreIds} />
                        </Field>
                        
                    </div>
                </div>

                

                <Recent />
            </div>
        );
    },

    // -----------------------------
    renderTile: function(category){
        const { core, dispatch } = this.props;
        const count = core[category].length;
        const onClick = () => dispatch(actions.changeTab(category));

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
const Menu = connect(
    state => { return { ...state }}
)(__Menu);

module.exports = Menu;
