Forge.components.controls.Number = React.createClass({
	// -----------------------------
	render: function(){
		const { Model, Value } = this.props;

		let value = Model.Value || Value;
		if (isNaN(value)) value = 0;

		return (
			<input type='number' value={value} onChange={this.change} />
		);
	},

	// -----------------------------
	getDefaultProps: function(){
		return { Model: {} };
	},

	// -----------------------------
	change: function(ev) {
		const onChange = this.props.onChange;
		const value = +ev.target.value;
		if (typeof onChange === 'function'){
			onChange(value, ev);
		}
	}
});