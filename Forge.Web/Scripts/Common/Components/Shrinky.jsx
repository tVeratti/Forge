const React = require('react');

// =====================================
const Shrinky = React.createClass({
    // -----------------------------
    render: function(){
        const { shrink } = this.state;
        const modifier = shrink ? 'shrink' : 'full';
        const className = `shrinky skrinky--${modifier}`;

        // When shrink is true, only the first child will remain visible.

        return (
            <div className={className}>
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
    checkScroll: function(ev){
        const shrink = document.scrollTop > 100;
        if (this.state.shrink !== shrink) {
            this.setState({ shrink });
        }
    }
});

module.exports = Banner;