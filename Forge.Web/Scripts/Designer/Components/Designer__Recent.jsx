// =====================================
// <Designer.Link />
// =====================================
Designer.__Recent = ({ category }) => {
    const { core, designer } = this.props;
    const recentNodes = core[designer.tab]
        .slice()
        .sort(x => x.ModifiedDate)
        .reverse()
        .slice(0, 5)
        .map((x, i) => <Designer.Link key={i} model={x} dispatch={dispatch} />);

    return (
        <div className='designer__recent'>
            <h4>Recent</h4>
            <ul>{recentNodes}</ul>
        </div>
    );
}

// =====================================
// Container
// =====================================
Designer.Recent = connect(
    state => { return { ...state }}
)(Designer.__Recent);
