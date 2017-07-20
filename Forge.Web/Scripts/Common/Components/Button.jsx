// =====================================
const Button = React.createClass({
    // -----------------------------
    render: function(){
        const { ...props } = this.props;
        const { coords, size, animate } = this.state;

        // Modify props before passing through.
        // Remove children from being passed as an attribute.
        delete props.children;

        // Add an additional class (conditional) if animating.
        if (animate) props.className += ' button--animate';

        return(
            <button {...props} onClick={this.onClick} ref='wrapper'>
                <span key={animate} className='button__clicky' style={{ ...coords, ...size }} ref='clicky' />
                {this.props.children}
            </button>
        );
    },

    // -----------------------------
    getDefaultProps: function(){
        return { className: 'button' };
    },

    // -----------------------------
    getInitialState: function(){
        return { animate: false, start: false };
    },

    // -----------------------------
    componentDidUpdate: function(prevProps, prevState){
        if (this.state.start && prevState.start == false){
            this.setState({ animate: true, start: false });
        }
    },

    // -----------------------------
    onClick: function(ev){
        const { onClick } = this.props;
        onClick && onClick(ev);

        // Move button__clicky to the mouse
        const { clicky, wrapper } = this.refs;
        const { scrollLeft, scrollTop } = document.body;

        // Get full size of clicky that matches the highest dimension of wrapper.
        const maxDimension = Math.max(wrapper.offsetHeight, wrapper.offsetWidth);
        const size = { width: maxDimension, height: maxDimension };

        // Get position of clicky
        const rect = wrapper.getBoundingClientRect();
        const offset = {
            left: rect.left + scrollLeft,
            top: rect.top + scrollTop
        };
        
        const coords = {
            left: (ev.pageX - offset.left - maxDimension/2) + 'px',
            top: (ev.pageY - offset.top - maxDimension/2) - 1 + 'px'
        };

        this.setState({ start: true, animate: false, coords, size });
    }
});

module.exports = Button;