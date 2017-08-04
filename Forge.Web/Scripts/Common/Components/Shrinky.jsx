const React = require('react');

// =====================================
const Shrinky = React.createClass({
    // -----------------------------
    render: function(){
        const { shrink } = this.state;
        const modifier = shrink ? 'shrink' : 'full';
        const className = `shrinky skrinky--${modifier}`;

        return (
            <div className={className} ref='wrapper'>
                {this.props.children}
            </div>
        );
    },

    // -----------------------------
    getInitialState: function(){
        return { shrink: document.scrollTop > 100 };
    },

    // -----------------------------
    componentDidMount: function(){
        document.addEventListener('scroll', this.checkScroll);
    },

    // -----------------------------
    componentDidUpdate: function(prevProps, prevState){
        if (this.state.shrink && !prevState.shrink){
            // Going from --full to --shrinky.
            // Get all elements that should stick to the bottom of the Shrinky,
            // then update their positions to reflect the new "bottom" of the Shrinky.
            const location = this.refs.wrapper.getBoundingClientRect().bottom;
            
            const stuckElements = document.getElementsByClassName('stick-to-shrinky');
            stuckElements.forEach(e => e.style.top = location + 'px');
        }
    },

    // -----------------------------
    checkScroll: function(ev){
        const shrink = document.scrollTop > 100;
        if (this.state.shrink !== shrink) {
            this.setState({ shrink });
        }
    }
});

module.exports = Shrinky;