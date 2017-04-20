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
            ? all.filter(x => contains((x.Name || '').toLowerCase(), filterLower))
            : [];
            
        listNodes = sortBy(listNodes, 'Name')
            .map(this.renderItem);

        return (
            <div>
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
            ...this.mapTabItems(core.Rules, CATEGORIES.RULES),
            ...this.mapTabItems(core.Tags, CATEGORIES.TAGS),
            ...this.mapTabItems(core.Definitions, CATEGORIES.DEFINITIONS)
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
        const key = `${item.tab}-${item.Id || item.TempId || item.Name}`;

        // ClassName modifiers.
        let className = 'designer__list-item';
        if (item.index === designer.index) className += ' designer__list-item--selected';

        // Click Handler.
        const onClick = () => dispatch(designerActions.navigate(item.tab, item.index));

        return (
            <li key={key} className={className}>
                <button className='button button--primary' onClick={onClick}>{item.Name}</button>
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
