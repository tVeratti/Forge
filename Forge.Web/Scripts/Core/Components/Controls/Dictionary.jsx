Forge.components.controls.Dictionary = React.createClass({
	render: function(){
		const { Keys } = this.props.Model;

		const keyNodes = (Keys || []).map(v => v.Key).join(', ');
		const listNodes = this.renderList(true);

		const dialogNode = this.state.dialog
			? this.renderEditDialog()
			: undefined;

		const editHandler = () => this.setState({ dialog: true });

		return (
			<div className='dictionary'>
				<div className='dictionary__tooltip' onClick={editHandler}>
					<Tooltip tip={listNodes}>
						<div className='input'>{keyNodes}</div>
					</Tooltip>
				</div>

				{dialogNode}
			</div>
		);
	},

	// -----------------------------
	getInitialState: function(){
		return { dialog: false };
	},

	// -----------------------------
	renderEditDialog: function(){
		const { Model, allowAdd } = this.props;

		const listNodes = this.renderList();

		const onClose = () => this.setState({ dialog: false });

		const formNode = allowAdd
			? this.renderAddForm()
			: undefined;

		return (
			<Dialog header={`Edit ${Model.Name}`} onClose={onClose}>
				{/* Add */}
				{formNode}

				{/* List */}
				<ul className='dictionary__list'>
					{listNodes}
				</ul>
			</Dialog>
		);
	},

	// -----------------------------
	renderAddForm: function(){
		return (
			<form className='dictionary__add' ref='form'>
				<input type='text' ref='key' placeholder='Key' />
				<input type='text' ref='value' placeholder='Value' />
				<button type='submit' className='button button--tertiary' onClick={this.add}>Add</button>
			</form>
		);
	},

	// -----------------------------
	renderList: function(flat){
		const { Model } = this.props;

		const list = Model.Keys || [];
		const listNodes = list.map((x, i) => this.renderPair(x, i, flat));
		return listNodes.length
			? <ul>{listNodes}</ul>
			: 'No Values';
	},

	// -----------------------------
	renderPair: function(item, index, flat){
		const { allowAdd } = this.props;
		const { Key, Value, ControlName } = item;

		const id = `k-${Key}`;
		const onChange = this.changePair.bind(this, index);

		const valueNode = flat
			? <span className='dictionary__value'>{Value}</span>
			: this.renderControl(item);

		const removeNode = flat || !allowAdd
			? undefined
			: <button className='button button--transparent' title='Remove'><span className='fa fa-remove'/></button>;

		return (
			<li key={id}>
				<label htmlFor={id} className='dictionary__key'>{Key}</label>
				{valueNode}
				{removeNode}
			</li>
		);
	},

	// -----------------------------
	renderControl: function(item, onChange){
		// Dynamically create the component based on Control name.
        return React.createElement(
            Forge.components.controls[item.Control || item.ControlName || 'Text'], 
            { Model: item, onChange }
        );
	},

	// -----------------------------
	changePair: function(index, value){
		const { ...list } = this.props.Model.AdditionalValues;

		list[index].Value = value;

		this.reportChange(list);
	},

	// -----------------------------
	add: function(){
		const { ...list } = this.props.Model.AdditionalValues;
		const { key, value, form } = this.refs;

		list.push({ Key: key.value, Value: value.value });
		this.reportChange(list);

		form.reset();
	},

	// -----------------------------
	reportChange: function(list) {
		const onChange = this.props.onChange;
		if (typeof onChange === 'function'){
			onChange(list);
		}
	}
});