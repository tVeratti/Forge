const React = require('react');

// =====================================
const Text = React.createClass({
	// -----------------------------
	render: function(){
		const { Model } = this.props;
		const { Keys } = Model;
		
		let value;
		if (Keys && 'Value' in Keys) value = Keys.Value;

		return <input id={Model._formId} type='text' value={value || ''} onChange={this.change} />;
	},

	// -----------------------------
	change: function(ev) {
		const { onChange, Model } = this.props;
		const { value } = ev.target;
		
		onChange && onChange({
			...Model.Keys,
			Value: value
		});
	}
});

module.exports = Text;