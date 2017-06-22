Forge.components.controls.Text = React.createClass({
	// -----------------------------
	render: function(){
		const { Model } = this.props;

		let value = Model.Value || '';	

		return <input id={Model._formId} type='text' value={value} onChange={this.change} />;
	},

	// -----------------------------
	change: function(ev) {
		const { onChange } = this.props;
		const { value } = ev.target;
		
		onChange && onChange(value);
	}
});