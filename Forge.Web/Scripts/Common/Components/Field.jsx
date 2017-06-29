// =====================================
// <Field />
// =====================================
const Field = ({ ...props }) => {

    let inputNode = props.children ||
        props.options
            ? <Select {...props} />
            : <input {...props} />;

    if (props.tooltip) {
        inputNode = <Tooltip tip={props.tooltip} icon={true}>{inputNode}</Tooltip>;
    }

    const afterNode = props.after
        ?  <span className='field__after'>{props.after}</span>
        : undefined;
            
    return (
        <div className='field'>
            <label className='field__label' htmlFor={props.id}>{props.label}</label>
            <span className='field__value'>{inputNode}</span>
           {afterNode}
        </div>
    );
}