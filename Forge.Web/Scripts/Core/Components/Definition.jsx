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
        const { stages } = Forge.lifeCycle;
        this.valueChange(this.props.model.Value, null, stages.init);
    },

    // -----------------------------
    componentWillReceiveProps: function(nextProps){
        const { core, model } = nextProps;
        const { stages } = Forge.lifeCycle;
        this.valueChange(nextProps.model.Value, null, stages.update, nextProps);
    },

    // -----------------------------
    valueChange: function(value, ev, stage, props) {
        const { lifeCycle, settings } = Forge;

        // Defaults (event triggered == null)
        stage = stage || lifeCycle.stages.update;
        props = props || this.props;

        const { model, core, dispatch } = props;

        // Apply all settings that match the current lifecycle
        model.Settings
            .filter(s => lifeCycle.isActive(s.LifeCycle, lifecycle))
            .forEach(s => value = settings.apply(value, s));
        
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