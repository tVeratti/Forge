// =====================================
const Select = ({ ...props }) => {
    const options = props.options || [];

    // Map options data into option elements.
    const optionNodes = options.map((option, index) => {
        const id = option.Id || option.id;
        const label = option.Name || option.Label;
        return <option key={`${id}-${index}`} value={id}>{label}</option>;
    });

    optionNodes.unshift(<option key='none' value={0}>-- Select --</option>);

    const onChange = (ev) => props.onChange && props.onChange(ev.target.value);

    return (
        <select className='select__input' {...props}>
            {optionNodes}
        </select>
    );
};

module.exports = Select;