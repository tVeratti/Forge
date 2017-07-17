const React = require('react');
const { Provider, connect} = require('react-redux');

const Definition = require('Core/Components/Definition.jsx');

// =====================================
// Presentation
// =====================================
const _Groups = (props) => {
    const { core } = props;
    const topGroups = core.Groups.filter(g => !g.ParentId);
    const groupNodes = topGroups.map(g => <Group key={g.Id} core={core} model={g} />);

    return (
        <div className='builder__groups'>
            {groupNodes}
        </div>
    );
};

// =====================================
// Container
// =====================================
const Groups = connect(
    state => { return { ...state }}
)(_Groups);

// =====================================
// <Group />
// =====================================
const Group = (props) => {
    const { core, model } = props;

    const childNodes = core.Groups
        .filter(g => g.ParentId == model.Id)
        .map(g => <Group key={g.Id} core={core} model={g} />);

    const definitionNodes = core.Definitions
        .filter(d => d.GroupId == model.Id)
        .map((d, i) => <Definition key={i} model={d} />);
    
    return (
        <div className='builder__group group panel'>
            <h4>{model.Name}</h4>
            <div className='group__definitions'>{definitionNodes}</div>
            <div className='group__children'>{childNodes}</div>
        </div>
    )
}

module.exports = Groups;