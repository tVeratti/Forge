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
            <Button className='button button--transparent stage__back' onClick={back} disabled={!history.length} title='Back' />
            <Button className='button button--transparent stage__forward' disabled={!history.length} title='Forward' />
            {/* <button className='button button--transparent stage__save-all' onClick={saveAll} disabled={!unsavedCountNode} title='Save All'>{unsavedCountNode}</button>*/}
            <span className='divider' />
            <Button className='button button--transparent stage__save' onClick={save} disabled={!item} title='Save' />
            <Button className='button button--transparent stage__delete' onClick={del} disabled={!item} title='Delete' />
        </div>
    );

};

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
