Forge.components.controls.Number = React.createClass({
	// propTypes: {
	// 	Value: React.PropTypes.oneOf([
	// 		React.PropTypes.string,
	// 		React.PropTypes.number
	// 	])
	// },

	// -----------------------------
	render: function(){
		return (
			<input type='number' value={this.props.Value || ''} onChange={this.change} />
		);
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