// =====================================
// Presentation
// =====================================
Designer.__DefinitionSettings = React.createClass({
    // -----------------------------
    render: function () {
        
        const nestedSettings = this.nestRules()
            .map(this.renderSetting);

        const contentNode = nestedSettings.length
            ? <Sortable list={nestedSettings} onChange={this.updateOrder} />
            : 'No Settings Applied';

        return (
            <div className='definition__settings'>
                {contentNode}
            </div>
        );
    },

    // -----------------------------
    renderSetting: function(setting, index){
        const { activeTagId } = this.props.designer;
        const removeHandler = this.removeSetting.bind(this, setting);

        // If a Tag is being hovered over, we want the related setting
        // to display with some emphasis and allow the user to see which
        // settings are added by whic tags.
        let className = 'definition__setting';
        let removeNode;
        if (activeTagId === setting.TagId) className += ' definition__setting--active';
        if (setting.TagId) className += ' definition__rule';
        else removeNode = <span className='definition__setting-remove' onClick={removeHandler} />;

        const controlNode = setting.TagId
            ? setting.Value
            : this.renderControl(setting, index);

        // This is the main control node that can modify the setting value.
        const primaryNodes = (
            <div className='field'>
                <label className='field__label'>{setting.Name}</label>
                <span className='field__value'>{controlNode}</span>
                {removeNode}
            </div>
        );

        if (setting.rules && setting.rules.length){
            // Map relevant rules underneath this setting so that
            // they can be displayed as children of this setting.
            const ruleNodes = setting.rules.map(r => {
                let className = 'definition__nested-rule';
                if (activeTagId === r.TagId) className += ' definition__nested-rule--active';
                return (
                    <li key={r.Name} className={className}>
                        <Field label={r.Name}>{r.Value}</Field>
                    </li>
                );
            });

            return (
                <div key={setting.SettingId} className={className}>
                    <Expandable header={primaryNodes}>
                        <ul className='definition__overrides field-group'>{ruleNodes}</ul>
                    </Expandable>
                </div>
            );
        } else {
            // Basic single setting row (no associated rules).
            return (
                <div key={setting.SettingId} className={className}>
                    {primaryNodes}
                </div>
            );
        }
    },

    // -----------------------------
    renderControl: function(setting, index){
        const controlName = setting.ControlName || setting.Control || 'Number';
        const controlProps = {
            Model: setting,
            Value: setting.Value || undefined,
            onChange: this.valueChange.bind(this, setting.SettingId)
        };

        // Dynamically create the component based on Control name.
       return React.createElement(
            Forge.components.controls[controlName], 
            controlProps
        );
    },

    // -----------------------------
    removeSetting: function(setting){
        const { dispatch, core, designer } = this.props;
        const { ...model } = core.Definitions[designer.index];

        // Update the value of one individual setting.
        let settings = [ ...model.Settings || [] ];
        let index = -1;

        model.Settings.some((s, i) => {
            if (s.SettingId == setting.SettingId) {
                index = i;
                return true;
            }
        });
        
        settings.splice(index, 1);
        model.Settings = settings;

        dispatch(coreActions.updateDefinition(model));
    },

    // -----------------------------
    nestRules: function(){
        const { core, designer } = this.props;
        const selectedItem = core.Definitions[designer.index];
        let { Settings, Rules } = selectedItem;

        Settings = Settings || [];
        Rules = Rules || [];
    
        let settingIds = Settings.map(s => s.SettingId);
        
        let flatSettings = Forge.utilities
            .sortSettings([ ...Settings, ...Rules ])
            .map(s => {
                const subRules = Rules.filter(r => {
                    return (!r.TagId || r.TagId != s.TagId)
                        && (r.SettingId == s.SettingId)
                });
                return { ...s, rules: subRules };
            });
        
        return flatSettings.filter(s => {
            // Only show 1 rule per setting (rest are nested).
            if (s.TagId) {
                const index = settingIds.indexOf(s.SettingId);
                if (index === -1) settingIds.push(s.SettingId);
                return index === -1;
            }
            return true;
        });
    },

    // -----------------------------
    valueChange: function(settingId, value, ev){
        const { dispatch, core, designer } = this.props;
        const { ...model } = core.Definitions[designer.index];

        // Update the value of one individual setting.
        const settings = [ ...(model.Settings || []) ];

        let prop = 'Value';
        if (typeof value === 'object') prop = 'AdditionalValues';

        settings.filter(s => s.SettingId === settingId)[0][prop] = value;

        model.Settings = settings;

        dispatch(coreActions.updateDefinition(model));
    },

    // -----------------------------
    updateOrder: function(initialIndex, newIndex, handler){
        const { dispatch, designer, core } = this.props;
        const { ...model } = core.Definitions[designer.index];

        // Use the handler given by the sortable to update the base array.
        let settings = handler(this.nestRules(), initialIndex, newIndex);
        let flatSettings = [];

        // Un-nest the settings in an order such that the nested rules have
        // have a Priority set just after its parent.
        settings.forEach(s => flatSettings = [ ...flatSettings, s, ...(s.rules || []) ]);

        // Set Priority based on index.
        flatSettings.forEach((s, i) => s.Priority = i);

        const sortedSettings = Forge.utilities.sortSettings(flatSettings);
        model.Settings = sortedSettings.filter(s => !s.TagId);
        model.Rules = sortedSettings.filter(s => !!s.TagId);

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.DefinitionSettings = connect(
    state => { return { ...state }}
)(Designer.__DefinitionSettings);