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

            {/* <button className='button button--transparent stage__save-all' onClick={saveAll} disabled={!unsavedCountNode} title='Save All'>{unsavedCountNode}</button>*/}
            <span className='divider' />

            <ActionButton title='Save' onClick={save} disabled={!item} />
            <ActionButton title='Delete' onClick={del} disabled={!item} />
        </div>
    );
};

const ActionButton = (props) => {
    const titleLower = props.title.toLowerCase();
    return <Button className={`button button--link stage__${titleLower}`} {...props} />;
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
