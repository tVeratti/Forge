// =====================================
// Presentation
// =====================================
Designer.__Definition = React.createClass({    

    // -----------------------------
    render: function(){
        const { designer, core, dispatch } = this.props;
        
        const selectedItem = core.Definitions[designer.index];

        const update = (prop) => this.updateModel.bind(this, prop);
        const goToTags = () => dispatch(designerActions.changeTab(CATEGORIES.TAGS));
        const goToSettings = () => dispatch(designerActions.openList('Settings'));

        return (
            <div className='edit edit--definition' ref='wrapper'>

                {/* General */}
                <div className='panel'>
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
                </div>

                {/* Tags */}
                <div className='panel'>
                    <h4>Tags</h4>
                    <p className='summary'>Tags can be used to apply global rules, which will add settings with predfined values.</p>
                    <a className='button button--link' onClick={goToTags}>Edit Tags</a>
                    <Designer.DefinitionTags />
                    
                </div>

                {/* Settings */}
                <div className='panel'>
                    <h4>Settings</h4>
                    <p className='summary'>These settings change the behavior of this definition on the character builder. These will be applied to the definition in order from top to bottom (priority). <b>Drag a setting to re-order its priority level.</b></p>
                    <a className='button button--link' onClick={goToSettings}>Add Settings</a>
                    <div className='separator  separator--small' />
                    <Designer.DefinitionSettings />
                </div>

                {/* Preview */}
                <Forge.Definition model={selectedItem} />
            </div>
        )
    },

    // -----------------------------
    componentDidMount: function(){
        $(this.refs.wrapper).find('input')[0].focus();
    },

    // -----------------------------
    updateModel: function(prop, ev){
        const { designer, core, dispatch } = this.props;
        const { ...model } = core.Definitions[designer.index];
        model[prop] = ev.target.value;

        if (prop == 'ControlId') {
            // Get the new ControlName
            model.ControlName = core.Controls
                .filter(c => c.Id == ev.target.value)[0].Name;
        }

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.Definition = connect(
    state => { return { ...state } }
)(Designer.__Definition);
