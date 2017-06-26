// =====================================
// Presentation
// =====================================
Designer.__Groups = React.createClass({
    // -----------------------------
    render: function(){
        const groupNodes = this.renderGroups();

        return (
            <Dialog header='Edit Groups'>
                {/* Add */}
                <form className='designer__add-group' ref='form'>
                    <input type='text' ref='key' placeholder='Key' />
                    <input type='text' ref='value' placeholder='Value' />
                    <button type='submit' className='button button--tertiary' onClick={this.add}>Add</button>
			    </form>

                <Sortable list={groupNodes} />

            </Dialog>
        )
    },

    // -----------------------------
    renderGroups: function(){
        return this.props.Groups.map(g => {
            return (
                <div key={g.Id} className='designer__group'>
                    <input value={g.Name} />
                    <span className='fa fa-remove' onClick={this.remove} />
                </div>
            );
        });
    }
});

// =====================================
// Container
// =====================================
Designer.Groups = connect(state => {
    return { Groups: state.core.Groups };
})(Designer.__Groups);
