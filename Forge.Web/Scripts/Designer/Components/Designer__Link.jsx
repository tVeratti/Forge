// =====================================
// <Designer.Link />
// =====================================
Designer.Link = ({ model, dispatch, category }) => {
    const onClick = category
        ? () => dispatch(designerActions.navigate(category, model.index))
        : () => dispatch(designerActions.selectListItem(model.index));

    return <a onClick={onClick}>{model.Name}</a>
}