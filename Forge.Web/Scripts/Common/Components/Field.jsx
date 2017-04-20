// =====================================
// <Field />
// =====================================
const Field = ({ ...props }) => {

    let inputNode;
    if (!props.children) {
        inputNode = props.options
            ? <Select {...props} />
            : <input {...props} />;
    }
            
    return (
        <div className='field'>
            <label className='field__label' htmlFor={props.id}>{props.label}</label>
            <span className='field__value'>{props.children || inputNode}</span>
        </div>
    );
}