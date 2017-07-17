const React =           require('react');
const { connect} =      require('react-redux');

const commonActions =   require('Common/Actions.js');
const coreActions =     require('Core/Actions.js');

const Dialog =          require('Common/Components/Dialog.jsx');
const Sortable =        require('Common/Components/Sortable.jsx');

// Presentation
// =====================================
const __Groups = React.createClass({
    // -----------------------------
    render: function(){
        const groupNodes = this.renderGroups();
        const buttons = [
            <button onClick={this.submitGroups}>Save</button>,
            <button onClick={this.close}>Cancel</button>
        ];


        return (
            <Dialog header='Edit Groups' buttons={buttons}>
                {/* Add */}
                <div className='designer__add-group'>
                    <input type='text' ref='name' placeholder='Name' />
                    <button className='button button--tertiary' onClick={this.addGroup}>Add</button>
			    </div>

                <Sortable list={groupNodes} onChange={this.updateOrder}  />

            </Dialog>
        )
    },

    // -----------------------------
    getInitialState: function(){
        return { groups: this.props.Groups || [] };
    },

    // -----------------------------
    renderGroups: function(){
        return this.state.groups.map((g, i) => {

            const updateHandler = this.updateGroup.bind(this, i);
            const removeHandler = this.removeGroup.bind(this, i);

            return (
                <div className='designer__group'>
                    <input value={g.Name} onChange={updateHandler} />
                    <span className='designer__remove' onClick={removeHandler} />
                </div>
            );
        });
    },

    // -----------------------------
    updateOrder: function(initialIndex, newIndex, handler){
        // Use the handler given by the sortable to update the base array.
        const groups = handler(this.state.groups, initialIndex, newIndex);
        groups.forEach((g, i) => g.Order =  i);
        this.setState({ groups });
    },

    // -----------------------------
    submitGroups: function(){
        const { dispatch } = this.props;
        dispatch(coreActions.updateGroups(this.state.groups));
        this.close();
    },

    // -----------------------------
    addGroup: function(){
        const { name } = this.refs;

        const model = { Name: name.value };

        this.setState({
            groups: [
                ...this.state.groups,
                model
            ]
        });
    },

    // -----------------------------
    updateGroup: function(index, ev){
        const groups = [ ...this.state.groups ];
        groups[index].Name = ev.target.value;
        this.setState({ groups });
    },

    removeGroup: function(index){
        const groups = [ ...this.state.groups ];
        groups.splice(index, 1);

        this.setState({ groups });
    },

    close: function(){
        const { dispatch } = this.props;
        dispatch(commonActions.closeDialog());
    }
});

// Container
// =====================================
const Groups = connect(state => {
    return { Groups: state.core.Groups };
})(__Groups);

module.exports = Groups;
