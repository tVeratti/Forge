﻿// =====================================
// Presentation
// =====================================
Designer.__Definition = React.createClass({    

    // -----------------------------
    render: function(){
        const { designer, core, dispatch } = this.props;
        const { changeTab, openList, dialogTypes } = designerActions;
        
        const selectedItem = core.Definitions[designer.index];

        const update = (prop) => this.updateModel.bind(this, prop);

        const goToTags = () => dispatch(changeTab(CATEGORIES.TAGS));
        const goToSettings = () => dispatch(openList('Settings'));

        // Edit Groups
        const openGroupEdit = () => dispatch(commonActions.openDialog(dialogTypes.EDIT_GROUPS));
        const groupEditnode = <button className='button button--link' onClick={openGroupEdit}>Edit Groups</button>;

        return (
            <div className='edit edit--definition' ref='wrapper'>

                {/* General */}
                <div className='panel'>
                    <h4>General</h4>

                    <Checkbox label='Active'
                        id='active' 
                        value={selectedItem.Active}
                        onChange={update('Active')} />

                    <div className='field-group'>
                        <Field label='Name' 
                            id='name' 
                            value={selectedItem.Name}
                            onChange={update('Name')} />

                        <Field label='Group' 
                            id='group' 
                            value={selectedItem.GroupId} 
                            onChange={update('GroupId')}
                            options={core.Groups}
                            tooltip='Display group that this will be rendered inside of (Layout).'
                            after={groupEditnode} />                        

                        <Field label='Control' 
                            id='control' 
                            value={selectedItem.ControlId} 
                            onChange={update('ControlId')}
                            tooltip='Control that the user will use to modify the value(s).'
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
    updateModel: function(prop, value){
        
        const { designer, core, dispatch } = this.props;
        const { ...model } = core.Definitions[designer.index];
        model[prop] = value;

        if (prop == 'ControlId') {
            // Get the new ControlName
            const control = core.Controls.filter(c => c.Id == value)[0];
            model.ControlName = control && control.Name;
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
