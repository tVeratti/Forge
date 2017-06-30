// =====================================
// <Field />
// =====================================
const Field = ({ ...props }) => {

    const controlNode = props.children ||
        (props.options
            ? <Select {...props} />
            : <input {...props} />);

    const tooltipNode = props.tooltip
        ? <Tooltip tip={props.tooltip} icon={true}>?</Tooltip>
        : undefined;

    const afterNode = props.after
        ?  <span className='field__after'>{props.after}</span>
        : undefined;
            
    return (
        <div className='field'>
            <label className='field__label' htmlFor={props.id}>{props.label}</label>
            <span className='field__value'>{controlNode}</span>
            {afterNode}
        </div>
    );
}