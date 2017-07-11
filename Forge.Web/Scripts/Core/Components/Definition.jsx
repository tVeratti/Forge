const React = require('react');

// =====================================
const Definition = React.createClass({    
    // -----------------------------
    render: function() {
        const { ...model } = this.props.model;
        model._formId = `d-${model.Id}`;

        // Dynamically create the component based on Control name.
        const controlNode = Forge.utilities.renderControl(model, this.valueChange)

        return (
            <div className='definition'>
                <label htmlFor={model._formId} className='definition__name'>{model.Name}</label>
                <div className='definition__control'>{controlNode}</div>
            </div>
        );
    },

    // -----------------------------
    valueChange: function(value) {
        // dispatch
    },
});

module.exports = Definition;