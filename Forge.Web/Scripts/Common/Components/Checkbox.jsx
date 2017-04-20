// =====================================
// <Checkbox />
// =====================================
const Checkbox = ({ id, label, name }) => (
    <span className='checkbox'>
        <input className='checkbox__input' id={id} type='checkbox' name={name || id}/>
        <label className='checkbox__label' htmlFor={id}>{label}</label>
    </span>
)