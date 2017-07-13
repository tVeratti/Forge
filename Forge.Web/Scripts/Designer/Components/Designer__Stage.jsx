const React = require('react');
const { connect} = require('react-redux');

const designerActions =     require('Designer/Actions.js');
const coreActions =         require('Core/Actions.js');

const Preview =     require('./Stage/Designer__Preview.jsx');
const Menu =        require('./Stage/Designer__Menu.jsx');
const Recent =      require('./Stage/Designer__Recent.jsx');

const Tag =         require('./Stage/Edit/Designer__Tag.jsx');
const Rule =        require('./Stage/Edit/Designer__Rule.jsx');
const Definition =  require('./Stage/Edit/Designer__Definition.jsx');

const { CATEGORIES } = coreActions;

// Presentation
// =====================================
const __Stage = React.createClass({
    instructions: {
        Tags: 'A Tag can be used to logically group Settings and Definitions. Tags can be used to apply Rules to many Definitions at once (ie: Give all Definitions with the Tag of "Attribute" a Minimum value of 1).',
        Rules: 'Rules are pre-defined Settings that can be applied to many definitions using Tags.',
        Definitions: 'Definitions are all of the small bits of information that describe a character. These are the building blocks of a charater builder and how it behaves.'
    },

    // -----------------------------
    render: function () { 
        const { unsaved } = this.props.core;
        const { tab, index, itemHistory } = this.props.designer;
        const item = this.getSelectedItem();

        const uniqueId = item
            ? item.Id || item.TempId || item.Name
            : '';
        
        const className = `designer__stage stage stage--${tab.toLowerCase()}`;
        const stageKey = `${tab}-${index}-${uniqueId}`;

        const menuDisabled = !item;
        //const instructions = this.instructions[tab];

        const workspaceNode = this.renderStage();
        const headerNode = this.renderHeader();

        const unsavedKeys = Object.keys(unsaved);
        const unsavedCountNode = unsavedKeys.length
            ? <span className='stage__unsaved-count'>{unsavedKeys.length}</span>
            : undefined;

        return (
            <div className={className} key={stageKey}>

                {/* Actions */}
                <div className='stage__menu'>
                    <button className='button button--transparent stage__back' onClick={this.back} disabled={!itemHistory.length} title='Back' />
                    <button className='button button--transparent stage__save-all' onClick={this.saveAll} disabled={!unsavedCountNode} title='Save All'>{unsavedCountNode}</button>
                    <span className='divider' />
                    <button className='button button--transparent stage__save' onClick={this.save} disabled={menuDisabled} title='Save' />
                    <button className='button button--transparent stage__delete' onClick={this.delete} disabled={menuDisabled} title='Delete' />
                </div>

                {/* Workspace */}
                <div className='stage__workspace'>
                    {workspaceNode}
                </div>
            </div>
        );
    },

    // -----------------------------
    renderStage: function(){
        const { designer } = this.props;
        const selectedItem = this.getSelectedItem();

        if (!selectedItem 
            && designer.tab !== 'Preview'
            && designer.tab !== 'Menu'){
            return <Recent />;
        }

        // Return a specific editing stage component.
        switch(designer.tab){
            case CATEGORIES.TAGS:            return <Tag />;
            case CATEGORIES.RULES:           return <Rule />;
            case CATEGORIES.DEFINITIONS:     return <Definition />;
            case 'Preview':                  return <Preview />;
            
            default:                         return <Menu />
        }
    },

    // -----------------------------
    renderHeader: function(){
        const selectedItem = this.getSelectedItem();
        if (!selectedItem) return '\u00A0';

        return <span className='emphasis'>{selectedItem.Name}</span>;
    },

    // -----------------------------
    save: function(){
        this.props.dispatch(designerActions.saveModel());
    },

    // -----------------------------
    saveAll: function(){
        this.props.dispatch(coreActions.save());
    },

    // -----------------------------
    delete: function(){
        this.props.dispatch(designerActions.delete());
    },

    // -----------------------------
    back: function(){
         this.props.dispatch(designerActions.back());
    },

    // -----------------------------
    getSelectedItem: function(){
        const { designer, core } = this.props;
        return (core[designer.tab] || [])[designer.index];
    }
});

// Container
// =====================================
const Stage = connect(
    state => { return { ...state }}
)(__Stage);

module.exports = Stage;
