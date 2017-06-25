// -------------------------------------------------
// <Designer.__Search />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Search = React.createClass({

    // -----------------------------
    render: function () {
        const { all, filter } = this.state;
        const filterLower = filter.toLowerCase();

        let listNodes = filter
            ? all.filter(x => contains((x.Name || '').toLowerCase(), filterLower) || x.header)
            : [];
            
        listNodes = listNodes
            .filter((x, i) => !x.header || x.header && !(listNodes[i + 1] || {header:true}).header)
            .map(this.renderItem);

        return (
            <div className='designer__search'>
                <input value={filter} onInput={this.inputHandler} />
                <ul>{listNodes}</ul>
            </div>
        );
    },

    // -----------------------------
    getInitialState: function(){
        const all = this.concatCoreArrays();

        return { all, filter: '' };
    },

    // -----------------------------
    componentWillReceiveProps: function(nextProps){
        const all = this.concatCoreArrays();
        this.setState({ all });
    },

    // -----------------------------
    concatCoreArrays: function(){
        const { core } = this.props;

        return [
            { header: CATEGORIES.RULES },
            ...sortBy(this.mapTabItems(core.Rules, CATEGORIES.RULES), 'Name'),
            { header: CATEGORIES.TAGS },
            ...sortBy(this.mapTabItems(core.Tags, CATEGORIES.TAGS), 'Name'),
            { header: CATEGORIES.DEFINITIONS },
            ...sortBy(this.mapTabItems(core.Definitions, CATEGORIES.DEFINITIONS), 'Name')
        ];
    },

    // -----------------------------
    mapTabItems: function(items, tab){
        return items.map((item, index) => {
            return { ...item, index, tab };
        });
    },

    // -----------------------------
    renderItem: function(item){
        const { dispatch, designer } = this.props;
        const key = `${item.tab}-${item.Id || item.TempId || item.Name || item.header}`;

        if (item.header) {
            return <li key={key} className='designer__list-header'>{item.header}</li>;
        }

        // ClassName modifiers.
        let className = 'designer__list-item';
        if (item.unsaved) className += ' designer__list-item--unsaved';
        if (item.tab === designer.tab && item.index === designer.index) className += ' designer__list-item--selected';

        // Click Handler.
        const onClick = () => dispatch(designerActions.navigate(item));

        return (
            <li key={key} className={className}>
                <button className='button button--transparent' onClick={onClick}>
                    {item.Name}
                </button>
            </li>
        );
    },

    // -----------------------------
    inputHandler: function(evt){
        const { value } = evt.target;
        this.setState({ filter: value });
    }
});

// =====================================
// Container
// =====================================
Designer.Search = connect(
    state => { return { ...state }}
)(Designer.__Search);
