// =====================================
// Presentation
// =====================================
Designer.__DefinitionTags = React.createClass({
    // -----------------------------
    render: function () {
        
        var tagNodes = this.renderTags();
        var addTagNode = this.renderAddTag();

        return (
            <div className='definition__tags field'>
                <label className='field__label'>{addTagNode}</label>
                <div className='field__value'><div className='tags'>{tagNodes}</div></div>
            </div>
        );
    },
 
    // -----------------------------
    getInitialState: function(){
        return { };
    },

    // -----------------------------
    renderAddTag: function(){
        const { core, designer } = this.props;
        const selectedItem = core.Definitions[designer.index];

        const activeIds = (selectedItem.Tags || []).map(t => t.Id);
        const tagOptions = core.Tags
            .filter(tag => activeIds.indexOf(tag.Id) === -1)
            .map(tag => <option key={tag.Id} value={tag.Id}>{tag.Name}</option>);

        return (
            <select className='button button--tertiary' onChange={this.changeNewTag} value='default' id='add-tag'>
                <option disabled value='default'>Add</option>
                {tagOptions}
            </select>
        );
    },

    // -----------------------------
    renderTags: function(){
        const { core, designer, dispatch } = this.props;
        const selectedItem = core.Definitions[designer.index];

        // Map tags into spans that can be removed onClick
        return (selectedItem.Tags || []).map((tag, index) => {
            const removeTagHandler = this.removeTag.bind(this, index);

            const clickHandler = () => {
                const newId = tag.Id !== designer.activeTagId ? tag.Id : null;
                dispatch(designerActions.activateTag(newId));
            };

            let className = 'button button--secondary definition__tag';
            if (tag.Id === designer.activeTagId) className += ' definition__tag--active';

            return (
                <button className={className} onClick={clickHandler} key={tag.Id}>
                    <span className='definition__tag-name'>{tag.Name}</span>
                    <span className='fa fa-remove' onClick={removeTagHandler} />
                </button>
            );
        });
    },

    // -----------------------------
    changeNewTag: function(event){
        var newTagId = +event.target.value;
        this.addTag(newTagId);
    },

    // -----------------------------
    removeTag: function(index){
        const { core, designer } = this.props;
        const selectedItem = core.Definitions[designer.index];
        const newTags = [ ...selectedItem.Tags || [] ];

        // Remove the given tag from this array
        newTags.splice(index, 1);

        // Report the change
        this.reportChange(newTags);
    },

    // -----------------------------
    addTag: function(tagId){
        const { core, designer } = this.props;
        const selectedItem = core.Definitions[designer.index];
        const newTags = [ ...selectedItem.Tags || [] ];

        // Check first if this tag is already present in the array
        var tagExists = !!newTags.filter((t) => tagId == t.Id).length;

        if (!tagExists){

            // Get the full tag object from the store
            var tag = core.Tags.filter((t) => t.Id == tagId)[0];

            // Add the tag to this array
            newTags.push(tag);

            // Report the change
            this.reportChange(newTags);
        }
    },

    // -----------------------------
    reportChange: function(tags){
        this.updateModel(tags);
    },

    // -----------------------------
    updateModel: function(tags){
        const { designer, dispatch, core } = this.props;
        const { ...model } = core.Definitions[designer.index];
        model.Tags = tags;

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.DefinitionTags = connect(
    state => { return { ...state }}
)(Designer.__DefinitionTags);