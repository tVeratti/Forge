const React = require('react');
const { connect} = require('react-redux');

const { CATEGORIES, actions } = require('Core');
const Link = require('Designer/Components/Link.jsx');

// Presentation
// =====================================
const __Recent = ({ core, designer, dispatch }) => {
    const categories = [ CATEGORIES.TAGS, CATEGORIES.RULES, CATEGORIES.DEFINITIONS ];
    const sourceItems = [ ...core.Tags, ...core.Rules, ...core.Definitions ];

    const recentNodes = sourceItems
        .slice()
        .sort((a, b) => { return new Date(b.ModifiedDate) - new Date(a.ModifiedDate) })
        .reverse()
        .slice(0, 5)
        .map((x, i) => <li key={i}><Link model={x} /></li>);
    
    const startNodes = categories.map(c => {
        const createItem = () => dispatch(actions.createItem(c));
        const label = c.slice(0, -1);
        const disabled = core.Game.IsLocked;
        return (
            <li key={c}>
                <button className='button button--link' onClick={createItem} disabled={disabled}>New {label}</button>
            </li>
        );
    });

    return (
        <div className='designer__recent recent panel'>
            
            <div className='recent__columns'>
                <ul>
                    <li className='recent__header'>Create</li>
                    {startNodes}
                </ul>
                <ul>
                    <li className='recent__header'>Recent</li>
                    {recentNodes}
                </ul>
                <ul>
                    <li className='recent__header'>Help</li>
                    <li><button className='button button--link'>Getting Started</button></li>
                    <li><button className='button button--link'>Publish Your Game</button></li>
                    <li><button className='button button--link'>FAQ</button></li>
                </ul>
            </div>
        </div>
    );
}

// =====================================
// Container
// =====================================
const Recent = connect(
    state => { return { ...state }}
)(__Recent);


module.exports = Recent;