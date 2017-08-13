const React = require('react');

const { utilities, actions } = require('Core');
const { dispatch } = require('Store.js');

// =====================================
const Definition = React.createClass({    
    // -----------------------------
    render: function() {
        const { ...model } = this.props.model;
        model._formId = `d-${model.Id}`;

        // Dynamically create the component based on Control name.
        const controlNode = utilities.renderControl(model, this.valueChange)

        return (
            <div className='definition'>
                <label htmlFor={model._formId} className='definition__name'>{model.Name}</label>
                <div className='definition__control'>{controlNode}</div>
            </div>
        );
    },

    // -----------------------------
    valueChange: function(keys) {
        const { ...model } = this.props.model;
        model.Keys = keys;
        console.log(keys)

        dispatch(actions.updateDefinition(model, true));
    }
});

module.exports = Definition;