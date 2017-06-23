// -------------------------------------------------
// <Designer.__Settings />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Settings = React.createClass({

    // -----------------------------
    render: function () {
        var settingNodes = this.renderSettingsList();

        return <ul>{settingNodes}</ul>;
    },

    // -----------------------------
    renderSettingsList: function(){
        const { settings, core, designer } = this.props;
        const activeItem = core.Definitions[designer.index];
        if (!activeItem) return;

        var activeSettings = (activeItem.Settings || []).map(s => s.Name);

        return settings.map(s => {

            const clickHandler = this.addSetting.bind(this, s);
            let className = 'setting';
            let disabled = false;
            if (contains(activeSettings, s.Name)) {
                className += ' setting--active';
                disabled = true;
            }

            return (
                <li key={s.Name} className={className}>
                    <button onClick={clickHandler} disabled={disabled}>
                        <span className='setting__icon' />
                        <span>{s.Name}</span>
                    </button>
                </li>
            );
        });
    },

    // -----------------------------
    addSetting: function(setting){
        const { dispatch, index } = this.props;
        dispatch(coreActions.addSetting(index, setting));
    }
});

// =====================================
// Container
// =====================================
Designer.Settings = connect(
    state => { return { 
        settings: state.core.Settings || [],
        index: state.designer.index,
        ...state
    }}
)(Designer.__Settings);
