const React = require('react');

const store = require('Store.js');
const actions = require('Designer/Actions.js');

const Button = require('Common/Components/Button.jsx');

// =====================================
const Link = ({ model, hideCategory }) => {
    const onClick = () => store.dispatch(actions.navigate(model));
    
    return (
        <Button className='button button--link designer__link' onClick={onClick}>
            <span>{model.Name}</span>
            { !hideCategory && <span className='button__subtitle'>{model.Category}</span> }
        </Button>
    )
}

module.exports = Link;