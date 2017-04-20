// -------------------------------------------------
// <Designer.EditDefinition />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__EditDefinition = React.createClass({    

    // -----------------------------
    render: function(){
        const { designer, core } = this.props;
        
        const selectedItem = core.Definitions[designer.index];

        const update = (prop) => this.updateModel.bind(this, prop);

        return (
            <div className='edit edit--definition'>
                {/* General */}
                <h4>General</h4>

                <div className='field-group'>
                    <Field label='Name' 
                        id='name' 
                        defaultValue={selectedItem.Name} 
                        onChange={update('Name')} />

                    <Field label='Group' 
                        id='group' 
                        defaultValue={selectedItem.GroupId} 
                        onChange={update('GroupId')}
                        options={core.Groups} />

                    <Field label='Control' 
                        id='control' 
                        defaultValue={selectedItem.ControlId} 
                        onChange={update('ControlId')}
                        options={core.Controls} />
                </div>

                {/* Tags */}
                <h4>Tags</h4>
                <p className='summary'>Tags can be used to apply global rules, which will add settings with predfined values.</p>
                <Definition__Tags />

                {/* Settings */}
                <h4>Settings</h4>
                <p className='summary'>These settings change the behavior of this definition on the character builder. These will be applied to the definition in order from top to bottom (priority). <b>Drag a setting to re-order its priority level.</b></p>
                <div className='separator  separator--small' />
                <Definition__Settings />

                {/* Preview 
                <Forge.Definition {...selectedItem} />*/}
            </div>
        )
    },

    // -----------------------------
    updateModel: function(prop, ev){
        const { designer, core, dispatch } = this.props;
        const { ...model } = core.Definitions[designer.index];
        model[prop] = ev.target.value;

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.EditDefinition = connect(
    state => { return { ...state } }
)(Designer.__EditDefinition);
