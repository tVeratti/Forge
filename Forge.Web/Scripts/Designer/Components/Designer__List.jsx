// =====================================
// Presentation
// =====================================
Designer.__List = React.createClass({    
	// -----------------------------
	render: function(){
		const listNodes = this.renderList();
		const actionNodes = this.renderActions();

		var className = 					 ' designer__list';
		if (!listNodes) 		className += ' designer__list--empty';
		if (this.state.open) 	className += ' designer__list--open';
		else 					className += ' designer__list--closed';

		return (
			<div className={className}>

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
		return { open: true, listTab: 'List' };
	},

	// -----------------------------
	componentWillReceiveProps: function(nextProps){
		if (nextProps.tab !== this.props.tab &&
			nextProps.selectedItem == null){
			this.setState({ open: true, listTab: 'List' });
		}
	},

    // -----------------------------
	renderList: function(){
		const { tab, index } = this.props.designer;
		const { listTab } = this.state;

		switch(listTab){
			case 'Settings': return <Designer.Settings />;
			case 'Search': return <Designer.Search />;
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

			// Click Handler.
			var onClick = () => {
				this.setState({ open: false });
				this.props.dispatch(designerActions.selectListItem(i));
			}

			return (
				<li key={key} className={className}>
					<button className='button button--primary' onClick={onClick}>{item.Name}</button>
				</li>
			);
		});

		// Unshift the ADD button to the top of the list.
		nodes.unshift(
			<li key='add' className='designer__list-item'>
				<button className='button button--tertiary designer__add' onClick={this.new} title={'New'}>New</button>
			</li>
		);
		
		return nodes;
	},

	// -----------------------------
	renderActions: function(){
		const { tab } = this.props.designer;
		const { open, listTab } = this.state;

		const toggleText = open ? 'Hide' : 'Show';
		const toggle = () => this.setState({ open: !open });

		let buttons = ['List', 'Search'];
		if (tab === 'Definitions') buttons.push('Settings'); 

		const miniButtons = buttons.map(b => {
			const onClick = this.changeList.bind(this, b);
			let className = `button icon icon--${b.toLowerCase()}`;
			if (b === listTab) className += ' button--active';

			return <button key={b} className={className} title={b} onClick={onClick} />;
		});

		return (
			<div className='designer__list-actions'>
				<button className='button button--transparent designer__toggle' onClick={toggle} title={toggleText} />
				<div className='designer__mini-buttons'>
					{miniButtons}
				</div>
				
			</div>
		);
	},

	// -----------------------------
	changeList: function(tab){
		let open = this.state.open;
		if (!open) open = true;
		else if (tab === this.state.listTab) open = !open;

		this.setState({ listTab: tab, open });
	},

	// -----------------------------
	new: function(){
		this.props.dispatch(coreActions.createItem());
	}
});

// =====================================
// Container
// =====================================
Designer.List = connect(
    state => { return { ...state }}
)(Designer.__List);