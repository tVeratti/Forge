const React = require('react');

// =====================================
const Shrinky = React.createClass({
    // -----------------------------
    render: function(){
        const { shrink } = this.state;
        const modifier = shrink ? 'shrink' : 'full';
        const className = `shrinky shrinky--${modifier}`;

        return (
            <div className={className} ref='wrapper'>
                {this.props.children}
            </div>
        );
    },

    // -----------------------------
    getInitialState: function(){
        return { shrink: document.body.scrollTop > 100 };
    },

    // -----------------------------
    componentDidMount: function(){
        document.addEventListener('scroll', this.checkScroll);
        this.updateStuckElements();
    },

    // -----------------------------
    componentDidUpdate: function(prevProps, prevState){
        if (this.state.shrink !== prevState.shrink){
            clearInterval(this.interval);
            this.interval = setInterval(this.updateStuckElements, 10);
        }
    },

    // -----------------------------
    checkScroll: function(ev){
        const shrink = document.body.scrollTop > 100;
        if (this.state.shrink !== shrink) {
            this.setState({ shrink });
        }
    },

    // -----------------------------
    updateStuckElements: function(ev){
        // Going from --full to --shrinky or reverse.
        // Get all elements that should stick to the bottom of the Shrinky,
        // then update their positions to reflect the new 'bottom' of the Shrinky.
        const location = this.refs.wrapper.getBoundingClientRect().bottom;
        const stuckElements = document.querySelectorAll('.stick-to-shrinky');
        stuckElements.forEach(e => e.style.top = location + 'px');
        this.count += 10;
        if (this.count >= 400) clearInterval(this.interval);
    }
});

module.exports = Shrinky;