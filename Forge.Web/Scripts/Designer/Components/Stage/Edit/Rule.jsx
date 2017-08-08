const React = require('react');
const { connect} = require('react-redux');

const { actions, utilities } = require('Core');
const Field = require('Common/Components/Field.jsx');

// Presentation
// =====================================
const __Rule = React.createClass({    

    // -----------------------------
    render: function(){
        const { designer, core } = this.props;
        const selectedItem = core.Rules[designer.index];

        const update = (prop) => this.updateModel.bind(this, prop);
        const setting = core.Settings.filter(s => s.Id == selectedItem.SettingId)[0];
        const controlNode = setting
            ? utilities.renderControl(setting, update('Keys'))
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
                        tooltip='Anything with this tag will receive the setting logic below.'
                        options={core.Tags} />

                    <Field label='Setting'
                        id='setting'
                        value={selectedItem.SettingId}
                        onChange={update('SettingId')}
                        tooltip='The logic which is applied to anything with the above tag.'
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
        console.log(prop, value)
        model[prop] = value;

        dispatch(actions.updateRule(model));
    }
    
});

// Container
// =====================================
const Rule = connect(
    state => { return { ...state } }
)(__Rule);

module.exports = Rule;
