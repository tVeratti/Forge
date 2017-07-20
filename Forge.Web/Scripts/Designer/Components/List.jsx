const React = require('react');
const { connect} = require('react-redux');

const { actions, CATEGORIES } = require('Core');
const designerActions = require('Designer/Actions.js');

const Settings = require('./List/Settings.jsx');
const Search = require('./List/Search.jsx');
const Button = require('Common/Components/Button.jsx');

// Presentation
// =====================================
const __List = React.createClass({    
	// -----------------------------
	render: function(){
		const listNodes = this.renderList();
		const actionNodes = this.renderActions();

		var className = 					 ' designer__list';
		if (!listNodes) 		className += ' designer__list--empty';
		if (this.state.open) 	className += ' designer__list--open';
		else 					className += ' designer__list--closed';
		

		return (
			<div className={className} ref='wrapper'>
				{/* Actions */}
				{actionNodes}

				{/* All Tiles */}
				<ul className='designer__list-items'>
					{listNodes}
				</ul>
			</div>
		);
	},

	// -----------------------------
	getInitialState: function(){
		return { open: false, listTab: 'List' };
	},

	// -----------------------------
	componentWillReceiveProps: function(nextProps){
		const { designer } = nextProps;

		if (designer.tab !== this.props.designer.tab){
			this.setState({ listTab: 'List' });
		}
	},

    // -----------------------------
	renderList: function(){
		const { tab, index } = this.props.designer;
		const { listTab } = this.state;

		switch(listTab){
			case 'Settings': return 	<Settings />;
			case 'Search': return 		<Search />;
		}
		
		const list = this.props.core[tab];
		if (!Array.isArray(list)) return;

		// Map list items from the store model into nodes.
		const nodes = list.map((item, i) => {

			// Unique identifier for the VDOM.
			var key = `${tab}-${i}-${item.Id || item.Name || item.TempId}`;

			// ClassName modifiers.
			var className = 'designer__list-item';
			if (i === index) className += ' designer__list-item--selected';
			if (item.unsaved) className += ' designer__list-item--unsaved';

			// Click Handler.
			var onClick = () => {
				this.setState({ open: false });
				this.props.dispatch(designerActions.selectListItem(i));
			}

			return (
				<li key={key} className={className}>
					<Button className='button button--transparent' onClick={onClick}>{item.Name}</Button>
				</li>
			);
		});

		// Unshift the ADD button to the top of the list.
		nodes.unshift(
			<li key='add' className='designer__list-item'>
				
			</li>
		);
		
		return nodes;
	},

	// -----------------------------
	renderActions: function(){
		const { tab } = this.props.designer;
		const { open, listTab, navigated } = this.state;

		const toggleText = open ? 'Hide' : 'Show';
		const toggle = () => this.setState({ open: !open });

		let buttons = ['List', 'Search'];
		if (tab === CATEGORIES.DEFINITIONS) buttons.push('Settings'); 

		const miniButtons = buttons.map(b => {
			const onClick = this.changeList.bind(this, b);
			let className = `button icon icon--${b.toLowerCase()}`;
			if (b === listTab){
				className += ' button--active';
				if (navigated) className += ' button--flash';
			}

			return <Button key={b} className={className} title={b} onClick={onClick} />;
		});
		//<button className='button button--transparent designer__toggle' onClick={toggle} title={toggleText} /> 
		return (
			<div className='designer__list-actions'>
				
				<div className='designer__mini-buttons'>
					{miniButtons}
					<Button className='button icon icon--new' onClick={this.new} title={'New'} />
				</div>
			</div>
		);
	},

	// -----------------------------
	changeList: function(tab){
		let open = this.state.open;
		if (!open) { open = true; }

		this.setState({ listTab: tab, open });
	},

	// -----------------------------
	new: function(){
		this.setState({ open: false });
		this.props.dispatch(actions.createItem());
	}
});

// Container
// =====================================
const List = connect(
    state => { return { ...state }}
)(__List);

module.exports = List;