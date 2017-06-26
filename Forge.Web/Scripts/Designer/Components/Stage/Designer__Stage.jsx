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
        const { designer, core } = this.props;
        const { tab, index, itemHistory } = designer;

        const list = core[tab] || [];
        const item = list[index];

        const uniqueId = item
            ? item.Id || item.TempId || item.Name
            : '';
        
        const className = `designer__stage stage stage--${tab.toLowerCase()}`;
        const stageKey = `${tab}-${index}-${uniqueId}`;

        const menuDisabled = !selectedItem;
        const instructions = this.instructions[tab];

        const headerNode = this.renderHeader();
        const workspaceNode = this.renderWorkspace();

        return (
            <div className={className} key={stageKey}>

                <h3>{headerNode}</h3>

                {/* Actions (Back, Save, Delete...) */}
                <div className='stage__menu'>
                    <button className='button button--transparent stage__back' onClick={this.back} disabled={!itemHistory.length}>Back</button>
                    <button className='button button--transparent stage__save' onClick={this.save} disabled={menuDisabled}>Save</button>
                    <button className='button button--transparent stage__save-all' onClick={this.saveAll}>Save All</button>
                    <button className='button button--transparent stage__delete' onClick={this.delete} disabled={menuDisabled}>Delete</button>
                </div>

                <div className='stage__workspace'>
                    {/* Information / Tips */}
                    { instructions && <Banner>{instructions}</Banner> }

                    {/* Edit__* */}
                    {workspaceNode}
                </div>
            </div>
        );
    },

    // -----------------------------
    renderWorkspace: function(){
        const { designer, dispatch, core } = this.props;
        const selectedItem = this.getSelectedItem();

        // Show Recent when tab is valid but nothing selected.
        if (!selectedItem && designer.tab !== 'Preview'){
            return <Designer.Recent />;
        }

        // Return a specific editing stage component.
        switch(designer.tab){
            case CATEGORIES.TAGS:            return <Designer.Tag />;
            case CATEGORIES.RULES:           return <Designer.Rule />;
            case CATEGORIES.DEFINITIONS:     return <Designer.Definition />;
            case 'Menu':                     return <Designer.Menu />;
            case 'Preview':                  return <Designer.Preview />;
            default:                         return <Designer.Menu />
        }
    },

    // -----------------------------
    renderHeader: function(){
        var { designer } = this.props;
        const selectedItem = this.getSelectedItem();

        if (tab === 'Menu' || !selectedItem) return '\u00A0';

        return <span className='emphasis'>{selectedItem && selectedItem.Name}</span>;
    },

    // -----------------------------
    save: function(){
        this.props.dispatch(designerActions.saveModel());
    },

    // -----------------------------
    saveAll: function(){
        this.props.dispatch(coreActions.save());
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
