Forge.components.controls.Select_Definition = React.createClass({
	// -----------------------------
	render: function(){
		const { Model, Value } = this.props;
		const { core } = store.getState();
		
		let value = Model.Value || Value || '';		

		return <Select options={core.Definitions} value={value} onChange={this.change} />;
	},

	// -----------------------------
	getDefaultProps: function(){
		return { Model: {} };
	},

	// -----------------------------
	change: function(ev) {
		const onChange = this.props.onChange;
		const value = ev.target.value;
		if (typeof onChange === 'function'){
			onChange(value, ev);
		}
	}
});
