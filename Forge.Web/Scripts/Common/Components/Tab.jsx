// =====================================
// <Tab />
// =====================================
const Tab = React.createClass({
    // ----------------------------
    render: function(){
        const { id, name, onChange, label, checked } = this.props;
        let className = 'tab';
        if (checked) className += ' tab--checked';

        return (
            <span className={className}>
                <input className='tab__input' id={id} type='radio' name={name} onChange={onChange} ref='input' />
                <label className='tab__label' htmlFor={id}>{label}</label>
            </span>
        );
    },

    // ----------------------------
    componentDidMount: function () {
        // If the default value should be checked,
        // set default value to checked = true.
        if (this.props.checked) {
            this.refs.input.checked = true;
        }
    },

    // ----------------------------
    componentWillReceiveProps: function (nextProps) {
        var checked = nextProps.checked;
        this.refs.input.checked = checked;
    }
});