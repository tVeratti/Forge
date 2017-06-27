// =====================================
// Presentation
// =====================================
Designer.__Tag = React.createClass({    

    // -----------------------------
    render: function(){
        const { core, designer } = this.props;
        const selectedItem = core.Tags[designer.index];
        
        const ruleNodes = core.Rules
            .filter(rule => rule.TagId && rule.TagId === selectedItem.Id)
            .map(this.renderLink);

        const definitionNodes = core.Definitions
            .filter(d => {
                const defTags = (d.Tags || []).map(t => t.Id);
                return d.Id && defTags.indexOf(selectedItem.Id) !== -1;
            })
            .map(this.renderLink);

        return (
            <div className='edit edit--tag' ref='wrapper'>

                <div className='panel'>
                    <h4>General</h4>
                    <Field label='Name' id='tag-name' type='text' value={selectedItem.Name} onChange={this.updateTagName} />
                </div>

                <div className='panel edit__information'>
                    <h4>Tagged Items</h4>
                    <p className='summary'>View objects which currently have this tag applied to them.</p>

                    {/* Rules that have this tag applied to them */}
                    <Field label='Rules'>
                        <ul className='list list--static'>
                            {ruleNodes}
                        </ul>
                    </Field>

                    <div className='separator small' />

                    {/* Definitions that have this tag applied to them */}
                    <Field label='Definitions'>
                        <ul className='list list--static'>
                            {definitionNodes}
                        </ul>
                    </Field>
                </div>
            </div>
        )
    },

    // -----------------------------
    renderLink: function(item, tab){
        const { dispatch } = this.props;
        const category = item.TagId ? 'Rules' : 'Definitions';

        return (
            <li key={item.Name} className='list__item'>
                <Designer.Link model={item} dispatch={dispatch} category={category} hideCategory={true} />
            </li>
        );
    },

    // -----------------------------
    updateTagName: function(value){
        const { designer, core, dispatch } = this.props;
        const { ...tag } = core.Tags[designer.index];
        tag.Name = value;

        dispatch(coreActions.updateTag(tag));
    }
});

// =====================================
// Container
// =====================================
Designer.Tag = connect(
    state => { return { ...state } }
)(Designer.__Tag);
