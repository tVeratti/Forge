// =====================================
const Field = ({ ...props }) => {
    const change = (ev) => props.onChange(ev.target.value);

    const controlNode = props.children ||
        (props.options
            ? <Select {...props} onChange={change} />
            : <input {...props} onChange={change} />);

    const tooltipNode = props.tooltip
        ? <Tooltip tip={props.tooltip} icon={true}>?</Tooltip>
        : undefined;

    const afterNode = props.after
        ? <span className='field__after'>{props.after}</span>
        : undefined;
            
    return (
        <div className='field'>
            <label className='field__label' htmlFor={props.id}>{props.label}</label>
            <span className='field__value'>{controlNode}</span>
            {afterNode}
        </div>
    );
}

module.exports = Field;