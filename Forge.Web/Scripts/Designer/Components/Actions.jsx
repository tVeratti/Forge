const React = require('react');
const { connect } = require('react-redux');

const actions = require('Designer/Actions.js');

const Button = require('Common/Components/Button.jsx');

// Presentation
// =====================================
const __Actions = (props) => {

    const { dispatch, index, tab, history, core } = props;
    const item = (core[tab] || [])[index];

    const save =    () => dispatch(actions.saveModel());
    //const saveAll = () => dispatch(coreActions.save());
    const del =     () => dispatch(actions.delete());
    const back =    () => dispatch(actions.back());

    return (
        <div className='stage__menu'>
            <ActionButton title='Back' onClick={back} disabled={!history.length} />
            <ActionButton title='Forward' disabled={!history.length} />
            <ActionButton title='Create' disabled={tab === 'Menu' || tab === 'Preview'} />
            <ActionButton title='Copy' disabled={!item} />
            <ActionButton title='Bookmark' disabled={!item} />
            <ActionButton title='Save' onClick={save} disabled={!item} />
            <ActionButton title='Delete' onClick={del} disabled={!item} />
        </div>
    );
};

const ActionButton = (props) => {
    const titleLower = props.title.toLowerCase();
    return <Button className={`button button--transparent icon icon--${titleLower}`} {...props} />;
}

// Container
// =====================================
const Actions = connect(
    state => { 
        return {
            index:      state.designer.index,
            tab:        state.designer.tab,
            history:    state.designer.itemHistory,
            core:       state.core
         }
    }
)(__Actions);

module.exports = Actions;
