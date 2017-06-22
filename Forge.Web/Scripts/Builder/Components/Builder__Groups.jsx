// =====================================
// Presentation
// =====================================
Builder._Groups = (props) => {
    const { core } = props;
    const topGroups = core.Groups.filter(g => !g.ParentId);
    const groupNodes = topGroups.map(g => <Builder.Group key={g.Id} core={core} model={g} />);

    return (
        <div className='builder__groups'>
            {groupNodes}
        </div>
    );
};

// =====================================
// Container
// =====================================
Builder.Groups = connect(
    state => { return { ...state }}
)(Builder._Groups);

// =====================================
// <Builder.Group />
// =====================================
Builder.Group = (props) => {
    const { core, model } = props;

    const childNodes = core.Groups
        .filter(g => g.ParentId == model.Id)
        .map(g => <Builder.Group key={g.Id} core={core} model={g} />);

    const definitionNodes = core.Definitions
        .filter(d => d.GroupId == model.Id)
        .map((d, i) => <Forge.Definition key={i} model={d} />);
    
    return (
        <div className='builder__group group panel'>
            <h4>{model.Name}</h4>
            <div className='group__definitions'>{definitionNodes}</div>
            <div className='group__children'>{childNodes}</div>
        </div>
    )
}