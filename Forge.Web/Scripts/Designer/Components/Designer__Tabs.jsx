// -------------------------------------------------
// <Designer.Tabs />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Tabs = React.createClass({
    views: ['Menu', 'Tags', 'Rules', 'Definitions'],

    // -----------------------------
    render: function () {
        var tabNodes = this.views.map(this.renderTab);

        return (
            <div className='tab-group'>
                {tabNodes}
            </div>
        );
    },

    // -----------------------------
    renderTab: function (label, index) {
        // Active Tab Check
        var checked = label === this.props.tab || undefined;
        
        // Click Handler
        // Dispatch action to store and update filter for tab.
        var onClick = () => this.props.dispatch(designerActions.changeTab(label));

        return (
            <Tab key={label} id={label} label={label} onChange={onClick} name='designer-tabs' checked={checked} />
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Tabs = connect(
    state => { return { tab: state.designer.tab }}
)(Designer.__Tabs);
