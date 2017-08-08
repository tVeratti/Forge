const Select = require('./Select.jsx');
const Tooltip = require('./Tooltip.jsx');

// =====================================
const Field = ({ ...props }) => {
    let className = 'field';

    const change = (ev) => props.onChange(ev.target.value);

    const tooltipNode = props.tooltip
        ? <Tooltip tip={props.tooltip} icon={true}>?</Tooltip>
        : undefined;

    const afterNode = props.after
        ? <span className='field__after'>{props.after}</span>
        : undefined;

    if (afterNode) className += ' field--embed-after';

    delete props.tooltip;
    delete props.after;

    const controlNode = props.children ||
        (props.options
            ? <Select {...props} onChange={change} />
            : <input {...props} onChange={change} />);

    return (
        <div className={className}>
            <label className='field__label' htmlFor={props.id}>{props.label}</label>
            <span className='field__value'>{controlNode}</span>
            {afterNode}
        </div>
    );
}

module.exports = Field;