Forge.components.controls.Number = React.createClass({
	// -----------------------------
	render: function(){
		const { Model } = this.props;

		let value = Model.Value;
		if (isNaN(value)) value = 0;

		return (
			<input id={Model._formId} type='number' value={value} onChange={this.change} />
		);
	},

	// -----------------------------
	change: function(ev) {
		const { onChange } = this.props;
		const { value } = ev.target;
		
		onChange && onChange(+value);
	}
});