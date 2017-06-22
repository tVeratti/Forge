Forge.components.controls.DefinitionSelect = React.createClass({
	// -----------------------------
	render: function(){
		const { Model, Value } = this.props;
		const { core } = store.getState();
		
		const options = core.Definitions.map(d => { return { Id: d.Id, Label: d.Name }});

		let value = Model.Value || Value || '';		

		return <Select options={options} value={value} onChange={this.change} />;
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
