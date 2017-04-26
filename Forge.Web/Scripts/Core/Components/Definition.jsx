// --------------------------------------------------
// <Forge.Definition />

// - Settings
// - ControlName
// - Value
// --------------------------------------------------
Forge.__Definition = React.createClass({    
    // -----------------------------
    render: function() {
        const { model } = this.props;
        const { ControlName, Control } = model;
        const controlName = ControlName || Control || 'Number';
        const controlProps = {
            Model: model,
            onChange: this.valueChange
        };

        // Dynamically create the component based on Control name.
        const controlNode = React.createElement(
            Forge.components.controls[controlName], 
            controlProps
        );

        return (
            <div className='definition'>
                <p className='definition__name'>{model.Name}</p>
                <p className='definition__control'>{controlNode}</p>
            </div>
        );
    },
    // -----------------------------
    componentWillMount: function(){
        // Trigger Lifecycle: Initialize
        this.valueChange(this.props.model.Value, null, Forge.stages.init);
    },

    // -----------------------------
    componentWillReceiveProps: function(nextProps){
        if (this.props.model.Value == nextProps.model.Value){
            // Trigger Lifecycle: Update.Only do this when something other
            // than the internal value has changed (ie: Settings).
            this.valueChange(nextProps.model.Value, null, Forge.stages.update, nextProps);
        }
    },

    // -----------------------------
    computeSettings: function(props){
        const { model, core } = props;

        return [
            ...model.Settings,
            ...Forge.functions.getRules(model.Tags, core.Rules)
        ];
    },

    // -----------------------------
    valueChange: function(
        value,
        evt,
        lifecycle = Forge.stages.update,
        props = this.props) {

        const { model, core, dispatch } = props;

        // Only include settings that match the current lifecycle
        const computedSettings = this.computeSettings(props || this.props)
            .filter(s => Forge.functions.isSettingAlive(s.LifeCycle, lifecycle));

            console.log(computedSettings)

        // Order by Priority / IsRule
        Forge.functions.sortSettings(computedSettings)
            // Apply all settings
            .forEach(s => value = Forge.settings[s.Name](value, s.Value));
        
        if (value !== props.model.Value){
            dispatch(coreActions.updateDefinition({
                ...model,
                Value: value
            }));
        };
    }
});

// =====================================
// Container
// =====================================
Forge.Definition = connect(
    state => { return { core: state.core }}
)(Forge.__Definition);