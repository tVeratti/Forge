// -------------------------------------------------
// <Designer.EditTag />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__EditTag = React.createClass({    

    // -----------------------------
    render: function(){
        const { core, designer } = this.props;
        const selectedItem = core.Tags[designer.index];
        
        const ruleNodes = core.Rules
            .filter(rule => rule.TagId && rule.TagId === selectedItem.Id)
            .map(this.renderLink);

        const definitionNodes = core.Definitions
            .filter(def => {
                const defTags = def.Tags.map(t => t.Id);
                return def.Id && defTags.indexOf(selectedItem.Id) !== -1;
            })
            .map(this.renderLink);

        return (
            <div className='edit edit--tag'>
                <Field label='Name' id='tag-name' type='text' defaultValue={selectedItem.Name} onChange={this.updateTagName} />
                
                <div className='separator' />

                <div className='edit__information'>

                    <Banner header='Active Links' icon='linked'>View objects which currently have this tag applied to them.</Banner>

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

        return (
            <li key={item.Name} className='list__item'>
                <a>{item.Name}</a>
            </li>
        );
    },

    // -----------------------------
    updateTagName: function(ev){
        const { designer, core, dispatch } = this.props;
        const { ...tag } = core.Tags[designer.index];
        tag.Name = ev.target.value;

        dispatch(coreActions.updateTag(tag));
    }
});

// =====================================
// Container
// =====================================
Designer.EditTag = connect(
    state => { return { ...state } }
)(Designer.__EditTag);
