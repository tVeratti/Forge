// =====================================
const Checkbox = (props) => {
    const { id, label, name, checked, onChange } = props;

    return (
        <span className='checkbox'>
            <input className='checkbox__input' type='checkbox' {...props} />
            <label className='checkbox__label' htmlFor={id}>{label}</label>
        </span>
    );
}

module.exports = Checkbox;