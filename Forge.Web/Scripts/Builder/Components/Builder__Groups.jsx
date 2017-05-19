// =====================================
// Presentation
// =====================================
Builder._Groups = React.createClass({
    // -----------------------------
    render: function() {
        const { core } = this.props;
        const definitionNodes = core.Definitions.map(d => <Forge.Definition key={d.Id} model={d} />);

        return (
            <div className='builder__groups'>
                {definitionNodes}
            </div>
        );
    }
});

// =====================================
// Container
// =====================================
Builder.Groups = connect(
    state => { return { ...state }}
)(Builder._Groups);
