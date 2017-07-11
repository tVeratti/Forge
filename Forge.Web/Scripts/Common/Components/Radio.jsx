// =====================================
const Radio = ({ id, label, name }) => (
    <span className='radio'>
        <input className='radio__input' id={id} type='radio' name={name}/>
        <label className='radio__label' htmlFor={id}>{label}</label>
    </span>
)

module.exports = Radio;