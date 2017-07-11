// =====================================
// Presentation
// =====================================
Library.__Filters = React.createClass({
    // --------------------------------
    render: function(){
        const permissionNodes = this.renderPermissionTabs();
        const keywordNode = this.renderKeywordInput();
        const genreNode = this.renderGenreSelect();

        return (
            <div className='library__filters'>
                
                <div>
                    {/* Permission Types */}
                    {permissionNodes}
                </div>
                
                <div className='library__other-filters'>
                    {/* Other Filters */}
                    {keywordNode}
                </div>

            </div>
        );
    },

    // --------------------------------
    renderPermissionTabs: function(){
        // Get action types from libraryActions.
        const { SHOW_PUBLIC, SHOW_MINE, SHOW_SHARED } = libraryActions.filters;
        const { PERMISSION } = libraryActions.filterTypes;

        // Prepare some options for permission filters.
        const permissionTypes = [
            { id: SHOW_PUBLIC,     label: 'Public' },
            { id: SHOW_MINE,       label: 'My Games' },
            { id: SHOW_SHARED,     label: 'Shared with Me' }
        ];

        // Render permission options into Tab nodes.
        const tabNodes = permissionTypes.map(permission => {
            const tabHandler = this.changeFilter.bind(this, PERMISSION, permission.id);
            const checked = permission.id === this.props.library.filters[PERMISSION];
            return <Tab key={permission.id} name='access-tab' onChange={tabHandler} checked={checked} {...permission} />;
        });

        return <div className='library__permissions tab-group'>{tabNodes}</div>;
    },

    // --------------------------------
    renderKeywordInput: function(){
        const { KEYWORD } = libraryActions.filterTypes;
        const inputHandler = this.changeFilter.bind(this, KEYWORD);

        return <input className='library__keyword' onInput={inputHandler} />;
    },

    // --------------------------------
    renderGenreSelect: function(){
        const { GENRE } = libraryActions.filterTypes;
        const changeHandler = this.changeFilter.bind(this, GENRE);

        return <GenreSelect onChange={changeHandler} />;
    },

    // --------------------------------
    changeFilter: function(key, event){
        const value = event.target ? event.target.value : event;
        
        // Update store state and request games with new filters.
        this.props.dispatch(libraryActions.filterGames(key, value));
    }
});

// =====================================
// Container
// =====================================
Library.Filters = connect(
    state => { return { library: state.library } }
)(Library.__Filters);
