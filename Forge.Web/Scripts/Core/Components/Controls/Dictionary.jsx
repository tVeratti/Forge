const React = require('react');

const ToolTip = require('Common/Components/Tooltip.jsx');
const controls = {};

// =====================================
const Dictionary = React.createClass({
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
				{/* Keys Preview / ToolTip */}
				<Tooltip tip={listNodes} onClick={editHandler}>
					<div className='input'>{keyNodes}</div>
				</Tooltip>

				{/* Dialog - Edit Values */}
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

		const dialogProps = {
			header: `Edit: ${Model.Name}`,
			onClose: () => this.setState({ dialog: false })
		};

		const formNode = allowAdd
			? this.renderAddForm()
			: undefined;

		const listNodes = this.renderList();

		return (
			<Dialog {...dialogProps}>
				{/* Add */}
				{formNode}

				{/* List */}
				{listNodes}
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
			? <ul className='dictionary__list'>{listNodes}</ul>
			: 'No Values';
	},

	// -----------------------------
	renderPair: function(item, index, flat){
		const { allowAdd } = this.props;
		const { Key, Value, ControlName } = item;

		const id = `k-${Key}`;

		const valueNode = flat
			? <span className='dictionary__value'>{Value}</span>
			: this.renderControl(item, index);

		const removeNode = allowAdd && !flat
			? <button className='button button--transparent' title='Remove'><span className='fa fa-remove'/></button>
			: undefined;

		return (
			<li key={id}>
				<label htmlFor={id} className='dictionary__key'>{Key}</label>
				{valueNode}
				{removeNode}
			</li>
		);
	},

	// -----------------------------
	renderControl: function(item, index){
		const onChange = this.changePair.bind(this, index);

		// Dynamically create the component based on Control name.
        return React.createElement(
            controls[item.Control || item.ControlName || 'Text'], 
            { Model: item, onChange }
        );
	},

	// -----------------------------
	changePair: function(index, value){
		const { Keys } = this.props.Model;
		const list = Keys && [ ...Keys ];

		list[index].Value = value;

		this.reportChange(list);
	},

	// -----------------------------
	add: function(){
		const { Keys } = this.props.Model;
		const list = Keys && [ ...Keys ];

		list.push({ Key: key.value, Value: value.value });
		this.reportChange(list);

		form.reset();
	},

	// -----------------------------
	reportChange: function(list) {
		const { onChange } = this.props;
		const { value } = ev.target;
		
		onChange && onChange(list);
	}
});

module.exports = Dictionary;