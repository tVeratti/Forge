const React = require('react');

// =====================================
const Formula = React.createClass({
	// -----------------------------
	render: function(){
		const { Model } = this.props;


		return (
			<div className='formula'>
				<div className='formula__view' contentEditable onInput={this.inputHandler} ref='view' />
				<div className='formula__raw' ref='raw' />
			</div>
		);
	},

	// -----------------------------
	inputHandler: function(ev){
		const { view, raw } = this.refs;
		let value = view.innerHtml || '';

		['+', '-', '/', '*', '(', ')'].forEach(x => value =  value.split(x).join(' '));
		value = value.split(' ');
	},

	// -----------------------------
	change: function(ev) {
		const { onChange } = this.props;
		const { value } = ev.target;
		
		onChange && onChange(+value);
	}
});

module.exports = Formula;