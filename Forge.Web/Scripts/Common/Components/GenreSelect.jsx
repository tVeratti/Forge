// =====================================
// Presentation
// =====================================
const __GenreSelect = ({ ...props }) => {
    const id = 'genre-select';
    return (
        <span className='genre-select'>
            <label className='genre-select__label' htmlFor={id}>{props.label}</label>
            <select className='genre-select__input' id={id} onChange={props.onChange}>
                {props.genreNodes}
            </select>
        </span>
    );
};

// =====================================
// Container
// =====================================
const GenreSelect = connect(
    state => { return {
        genreNodes: state.common.genres.map(o => { 
            return <option key={o.id} {...o}>{o.value}</option>;
        })
    }}
)(__GenreSelect);