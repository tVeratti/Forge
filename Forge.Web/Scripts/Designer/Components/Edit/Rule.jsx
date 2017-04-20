// -------------------------------------------------
// <Designer.EditRule />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__EditRule = React.createClass({    

    // -----------------------------
    render: function(){
        const { designer, core } = this.props;
        const selectedItem = core.Rules[designer.index];

        const update = (prop) => this.updateModel.bind(this, prop);

        return (
            <div className='edit edit--rule field-group'>

                <Field label='Tag' 
                    id='tag'
                    defaultValue={selectedItem.TagId}
                    onChange={update('TagId')}
                    options={core.Tags} />

                <Field label='Setting'
                    id='setting'
                    defaultValue={selectedItem.SettingId}
                    onChange={update('SettingId')}
                    options={core.Settings} />

                <Field label='Value'
                    id='value'
                    defaultValue={selectedItem.Value}
                    onChange={update('Value')} />
            </div>
        )
    },

    // -----------------------------
    updateModel: function(prop, ev){
        const { designer, core, dispatch } = this.props;
        const { ...model } = core.Rules[designer.index];
        
        model[prop] = ev.target.value;

       
        if (prop === 'TagId' || prop === 'SettingId') {
            // Generate the name again based on tag/setting
            const tag = core.Tags.filter(t => t.Id == model.TagId)[0];
            const setting = core.Settings.filter(t => t.Id == model.SettingId)[0];

            model.Name = `${tag.Name} ${setting.Name}`;
        }

        dispatch(coreActions.updateRule(model));
    }
    
});

// =====================================
// Container
// =====================================
Designer.EditRule = connect(
    state => { return { ...state } }
)(Designer.__EditRule);
