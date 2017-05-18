// =====================================
// Presentation
// =====================================
Builder._Groups = React.createClass({
    // -----------------------------
    render: function() {
        const { core } = this.props;
        console.log(core)
        const definitionNodes = core.Definitions.map(this.renderDefinitions);

        return (
            <div className='builder__groups'>
                {definitionNodes}
            </div>
        );
    },

    renderDefinitions: function(definitions){
        return definitions.map(d => <Forge.Definition model={d} />);
    }
});

// =====================================
// Container
// =====================================
Builder.Groups = connect(
    state => { return { ...state }}
)(Builder._Groups);
