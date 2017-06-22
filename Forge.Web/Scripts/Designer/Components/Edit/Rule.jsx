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

                <div className='panel'>
                    <h4>General</h4>

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
            </div>
        )
    },

    // -----------------------------
    updateModel: function(prop, ev){
        const { designer, core, dispatch } = this.props;
        const { ...model } = core.Rules[designer.index];
        
        model[prop] = ev.target.value;

        dispatch(coreActions.updateRule(model));
    }
    
});

// =====================================
// Container
// =====================================
Designer.EditRule = connect(
    state => { return { ...state } }
)(Designer.__EditRule);
