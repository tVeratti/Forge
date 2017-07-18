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
                {animate && <span className='button__clicky' style={{ ...coords, ...size }} ref='clicky' />}
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
        return { animate: false };
    },

    componentDidUpdate: function(prevProps, prevState){
        
        if (this.state.animate && !prevState.animate){
            // Move button__clicky to the mouse
            const { x, y } = this.state;
            const { clicky, wrapper } = this.refs;
            const { scrollLeft, scrollTop } = document.body;

            // Get full size of clicky that matches the highest dimension of wrapper.
            const maxDimension = Math.max(wrapper.offsetHeight, wrapper.offsetHeight);
            const size = { width: maxDimension, height: maxDimension };

            // Get position of clicky
            const rect = wrapper.getBoundingClientRect();
            const offset = {
                left: rect.left + scrollLeft,
                top: rect.top + scrollTop
            };
            
            const coords = {
                left: (x - offset.left - clicky.offseWidth/2) + 'px',
                top: (y - offset.top - clicky.offsetHeight/2) + 'px'
            };
            
            this.setState({ coords, size });

            //setTimeout(() => this.setState({ animate: false }), 1000);
        }
    },

    // -----------------------------
    onClick: function(ev){
        const { onClick } = this.props;
        onClick && onClick(ev);

        this.setState({ animate: true, x: ev.pageX, y: ev.pageY });
    }
});

module.exports = Button;