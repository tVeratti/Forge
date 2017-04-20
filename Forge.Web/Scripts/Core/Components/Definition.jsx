// --------------------------------------------------
// <Forge.Definition />

// - Settings
// - ControlName
// - Value
// --------------------------------------------------
Forge.Definition = class Forge_Definition extends React.Component {
    constructor(){
        super();

        const {...state} = this.props;
        this.state = state;
    }
    
    // -----------------------------
    render() {
        const controlName = this.state.ControlName || this.state.Control || 'Number';
        const controlProps = {
            Model: this.state,
            onChange: this.valueChange
        };

        // Dynamically create the component based on Control name.
        const controlNode = React.createElement(
            Forge.components.controls[controlName], 
            controlProps
        );

        return (
            <div className='definition'>
                <p className='definition__name'>{this.state.Name}</p>
                <p className='definition__control'>{controlNode}</p>
            </div>
        );
    }

    // -----------------------------
    componentWillMount(){
        // Trigger Lifecycle: Initialize
        this.valueChange(this.state, Forge.stages.init);
    }

    // -----------------------------
    componentWillReceiveProps(nextProps){
        const {...nextModel} = nextProps;
        nextModel.Value = this.state.Value;

        // Trigger Lifecycle: Update
        this.valueChange(nextModel, Forge.stages.update);
    }

    // -----------------------------
    valueChange(previousModel, lifecycle){
        const { Settings, Tags } = this.props;
        const {...nextModel} = previousModel;

        // Get the current lifecycle stage
        lifecycle = lifecycle || Forge.stages.init;

        let value = nextModel.Value;

        // Merge DefinitionSettings with Rules
        let modelSettings = [
            ...Settings,
            ...Forge.functions.getRules(Tags)
        ];

        // Only include settings that match the current lifecycle
        modelSettings = modelSettings
            .filter(s => Forge.functions.isSettingAlive(s.LifeCycle, lifecycle));

        // Order by Priority / IsRule
        Forge.functions.sortSettings(modelSettings)
            // Apply all settings
            .forEach(setting => {
                value = Forge.settings[setting.Name](value, setting.Value);
            });
        
        // Update the model's value
        nextModel.Value = value;

        this.setState(nextModel);
    }
}