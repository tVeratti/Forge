// =====================================
// <Designer.Link />
// =====================================
Designer.Link = ({ model, hideCategory }) => {
    const onClick = () => store.dispatch(designerActions.navigate(model));
    
    return (
        <button className='button button--link designer__link' onClick={onClick}>
            <span>{model.Name}</span>
            { !hideCategory && <span>{model.Category}</span> }
        </button>
    )
}