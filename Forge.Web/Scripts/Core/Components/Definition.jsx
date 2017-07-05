// --------------------------------------------------
// <Forge.Definition />

// - Settings
// - ControlName
// - Value
// --------------------------------------------------
Forge.__Definition = React.createClass({    
    // -----------------------------
    render: function() {
        const { ...model } = this.props.model;
        model._formId = `d-${model.Id}`;

        // Dynamically create the component based on Control name.
        const controlNode = Forge.utilities.renderControl(model, this.valueChange)

        return (
            <div className='definition'>
                <label htmlFor={model._formId} className='definition__name'>{model.Name}</label>
                <div className='definition__control'>{controlNode}</div>
            </div>
        );
    },

    // -----------------------------
    componentWillMount: function(){
        // Trigger Lifecycle: Initialize
        const { core, model } = this.props;
        const { stages } = Forge.lifeCycle;
        this.valueChange(model.Value, stages.init);
    },

    // -----------------------------
    componentWillReceiveProps: function(nextProps){
        // Trigger Lifecycle: Update
        const { core, model } = nextProps;
        const { stages } = Forge.lifeCycle;
        this.valueChange(model.Value, stages.update, nextProps);
    },

    // -----------------------------
    valueChange: function(value, stage, props) {
        const { lifeCycle, settings } = Forge;
        
        // Defaults (event triggered == null)
        stage = stage || lifeCycle.stages.update;
        props = props || this.props;

        const { model, core, dispatch } = props;

        // Apply all settings that match the current lifecycle
        // model.MergedSettings
        //     .filter(s => lifeCycle.isActive(s.LifeCycle, stage))
        //     .forEach(s => value = settings.apply(value, s));

        if (typeof value == 'number' && isNaN(value)) value = 0;

        if (value != props.model.Value){
            dispatch(coreActions.updateDefinition({ ...model, Value: value }, true));
        };
    },
});

// =====================================
// Container
// =====================================
Forge.Definition = connect(
    state => { return { core: state.core }}
)(Forge.__Definition);