// =====================================
// Presentation
// =====================================
Designer.__Rule = React.createClass({    

    // -----------------------------
    render: function(){
        const { designer, core } = this.props;
        const selectedItem = core.Rules[designer.index];

        const update = (prop) => this.updateModel.bind(this, prop);

        const setting = core.Settings.fitler(s => s.Id === selectedItem.SettingId)[0];
        const controlNode = setting
            ? Forge.utilities.renderControl(setting, update('Values'))
            : 'Choose a Setting type';

        return (
            <div className='edit edit--rule field-group' ref='wrapper'>

                <div className='panel'>
                    <h4>General</h4>

                    <Field label='Name' 
                        id='name'
                        value={selectedItem.Name}
                        onChange={update('Name')} />

                    <Field label='Tag' 
                        id='tag'
                        value={selectedItem.TagId}
                        onChange={update('TagId')}
                        options={core.Tags} />

                    <Field label='Setting'
                        id='setting'
                        value={selectedItem.SettingId}
                        onChange={update('SettingId')}
                        options={core.Settings} />

                    <Field label='Value' id='value'>
                        {controlNode}
                    </Field>
                </div>
            </div>
        )
    },

    // -----------------------------
    updateModel: function(prop, value){
        const { designer, core, dispatch } = this.props;
        const { ...model } = core.Rules[designer.index];
        
        model[prop] = value

        dispatch(coreActions.updateRule(model));
    }
    
});

// =====================================
// Container
// =====================================
Designer.Rule = connect(
    state => { return { ...state } }
)(Designer.__Rule);
