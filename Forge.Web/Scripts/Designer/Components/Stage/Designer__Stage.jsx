﻿// -------------------------------------------------
// <Designer.Stage />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Stage = React.createClass({
    instructions: {
        Tags: 'A Tag can be used to logically group Settings and Definitions. Tags can be used to apply Rules to many Definitions at once (ie: Give all Definitions with the Tag of "Attribute" a Minimum value of 1).',
        Rules: 'Rules are pre-defined Settings that can be applied to many definitions using Tags.',
        Definitions: 'Definitions are all of the small bits of information that describe a character. These are the building blocks of a charater builder and how it behaves.'
    },

    // -----------------------------
    render: function () { 
        const { tab, index, itemHistory } = this.props.designer;
        const list = this.props.core[tab] || [];
        const selectedItem = list[index];
        const isMenu = tab === 'Menu';

        const editView = isMenu
            ? <Designer.Menu />
            : this.renderStage();

        let headerNode = '\u00A0';
        if (!isMenu && selectedItem) headerNode = this.renderSelectedHeader();

        const uniqueId = selectedItem
            ? selectedItem.Id || selectedItem.TempId || selectedItem.Name
            : '';
        
        const className = `designer__stage stage stage--${tab.toLowerCase()}`;
        const stageKey = `${tab}-${index}-${uniqueId}`;

        const menuDisabled = !selectedItem;
        const instructions = this.instructions[tab];

        return (
            <div className={className} key={stageKey}>

                <h3>{headerNode}</h3>

                <div className='stage__menu'>
                    <button className='button button--transparent stage__back' onClick={this.back} disabled={!itemHistory.length}>Back</button>
                    <button className='button button--transparent stage__save' onClick={this.save} disabled={menuDisabled}>Save</button>
                    <button className='button button--transparent stage__delete' onClick={this.delete} disabled={menuDisabled}>Delete</button>
                </div>

                <div className='stage__workspace'>
                    { instructions && <Banner>{instructions}</Banner> }

                    {/* Edit__* */}
                    {editView}
                </div>
            </div>
        );
    },

    // -----------------------------
    renderStage: function(){
        const { designer, dispatch, core } = this.props;
        const selectedItem = this.getSelectedItem();

        if (!selectedItem && designer.tab !== 'Preview'){

            const createItem = () => dispatch(coreActions.createItem());
            const createButton = (
                <button className='button button--tertiary designer__add' onClick={createItem}>
                    Create one
                </button>
            );
            
            if (!core[designer.tab] || !core[designer.tab].length){
                // No items exist in this list, prompt the user to create one...
                return (
                    <div className='panel panel--centered'>
                        No {designer.tab} exist for this game yet! {createButton}
                    </div>
                );

            } else {
                const recentNodes = core[designer.tab]
                    .slice()
                    .sort(x => x.updated)
                    .reverse()
                    .slice(0, 5)
                    .map((x, i) => <Designer.Link key={i} model={x} dispatch={dispatch} />);

                // Nothing selected yet
                return (
                    <div className='panel panel--centered'>
                        Select an item to edit or {createButton}

                        <div className='designer__recent'>
                            {recentNodes}
                        </div>
                    </div>
                );
            }
        }

        // Return a specific editing stage component.
        switch(designer.tab){
            case CATEGORIES.TAGS:            return <Designer.EditTag />;
            case CATEGORIES.RULES:           return <Designer.EditRule />;
            case CATEGORIES.DEFINITIONS:     return <Designer.EditDefinition />;
            case 'Preview':                  return <Designer.Preview />;
            default:                         return <Designer.Menu />
        }
    },

    // -----------------------------
    renderSelectedHeader: function(){
        var { designer } = this.props;
        const selectedItem = this.getSelectedItem();

        return (
            <div>
                <span className='breadcrumb'>{designer.tab}</span>
                <span className='emphasis'>{selectedItem && selectedItem.Name}</span>
            </div>
        );
    },

    // -----------------------------
    save: function(){
        this.props.dispatch(designerActions.saveModel());
    },

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

// =====================================
// Container
// =====================================
Designer.Stage = connect(
    state => { return { ...state }}
)(Designer.__Stage);