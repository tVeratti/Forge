const React = require('react');

const store = require('Store.js');
const actions = require('Designer/Actions.js');

// =====================================
const Link = ({ model, hideCategory }) => {
    const onClick = () => store.dispatch(actions.navigate(model));
    
    return (
        <button className='button button--link designer__link' onClick={onClick}>
            <span>{model.Name}</span>
            { !hideCategory && <span>{model.Category}</span> }
        </button>
    )
}

module.exports = Link;