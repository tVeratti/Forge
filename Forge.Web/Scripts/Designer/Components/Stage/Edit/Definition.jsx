const React = require('react');
const { connect } = require('react-redux');

const { CATEGORIES } = require('Core');

const designerActions =     require('Designer/Actions.js');
const commonActions =       require('Common/Actions.js');
const coreActions =         require('Core/Actions.js').actions;

const Field =               require('Common/Components/Field.jsx');
const Button =              require('Common/Components/Button.jsx');
const Definition =          require('Core/Components/Definition.jsx');
const DefinitionTags =      require('./DefinitionTags.jsx');
const DefinitionSettings =  require('./DefinitionSettings.jsx');

// Presentation
// =====================================
const __EditDefinition = React.createClass({    

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
        const groupEditnode = <Button onClick={openGroupEdit}>Edit Groups</Button>;

        return (
            <div className='edit edit--definition' ref='wrapper'>

                {/* General */}
                <div className='panel'>
                    <h4>General</h4>

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
                    <p className='summary'>Tags can be used to apply global rules, which will add settings with predefined values.</p>
                    <div className='separator  separator--small' />
                    <Button onClick={goToTags}>Edit Tags</Button>
                    <DefinitionTags />
                    
                </div>

                {/* Settings */}
                <div className='panel'>
                    <h4>Settings</h4>
                    <p className='summary'>These settings change the behavior of this definition on the character builder. These will be applied to the definition in order from top to bottom (priority). <b>Drag a setting to re-order its priority level.</b></p>
                    <div className='separator  separator--small' />
                    <Button onClick={goToSettings}>Add Settings</Button>
                    <div className='separator  separator--small' />
                    <DefinitionSettings />
                </div>

                {/* Preview */}

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

// Container
// =====================================
const EditDefinition = connect(
    state => { return { ...state } }
)(__EditDefinition);

module.exports = EditDefinition;
