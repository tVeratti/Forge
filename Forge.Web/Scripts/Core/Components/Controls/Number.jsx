const React = require('react');

// =====================================
const Number = React.createClass({
	// -----------------------------
	render: function(){
		const { Model } = this.props;
		const { Keys } = Model;
		
		let value;
		if (Keys && 'Value' in Keys) value = Keys.Value;
		if (isNaN(value)) value = 0;

		return (
			<input id={Model._formId} type='number' value={value || ''} onChange={this.change} />
		);
	},

	// -----------------------------
	change: function(ev) {
		const { onChange, Model } = this.props;
		let { value } = ev.target;
		
		onChange && onChange({
			...Model.Keys,
			Value: +value || 0
		});
	}
});

module.exports = Number;