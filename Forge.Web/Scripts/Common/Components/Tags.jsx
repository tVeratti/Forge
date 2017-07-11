const React = require('react');

// =====================================
const Tags = React.createClass({
    // -----------------------------
    render: function () {
        var tagNodes = this.renderTags();
        var addTagNode = this.renderAddTag();

        return (
            <div className='tags'>
                <div className='tags__add'>{addTagNode}</div>
                <div className='tags__list'>{tagNodes}</div>
            </div>
        );
    },
 
    // -----------------------------
    renderAddTag: function(){
        const { tags, options } = this.props;
        const activeIds = tags.map(t => t.Id);
        const tagOptions = options
            .filter(tag => activeIds.indexOf(tag.Id) === -1)
            .map(tag => <option key={tag.Id} value={tag.Id}>{tag.Name}</option>);

        return (
            <select className='button button--tertiary' onChange={this.changeNewTag}>
                <option disabled value='default'>-- Add --</option>
                {tagOptions}
            </select>
        );
    },

    // -----------------------------
    renderTags: function(){
        const { tags } = this.props;

        // Map tags into spans that can be removed onClick
        return tags.map((tag, index) => {

            const removeTagHandler = this.removeTag.bind(this, index);
            const className = 'button button--secondary tags__tag';

            return (
                <button className={className} key={tag.Id}>
                    <span className='tags__name'>{tag.Name}</span>
                    <span className='tags__remove' onClick={removeTagHandler} />
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
        const newTags = [ ...this.props.tags ];

        // Remove the given tag from this array
        newTags.splice(index, 1);

        // Report the change
        this.reportChange(newTags);
    },

    // -----------------------------
    addTag: function(tagId){
        const { options, tags } = this.props;
        const newTags = [ ...tags ];

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
        const { onChange } = this.props;
        onChange && onChange(tags);
    }
});

module.exports = Tags;