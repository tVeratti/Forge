// =====================================
// <Tab />
// =====================================
const Tab = React.createClass({
    // ----------------------------
    render: function(){
        var props = this.props;

        return (
            <span className='tab'>
                <input className='tab__input' id={props.id} type='radio' name={props.name} onChange={props.onChange} ref='input' />
                <label className='tab__label' htmlFor={props.id}>{props.label}</label>
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