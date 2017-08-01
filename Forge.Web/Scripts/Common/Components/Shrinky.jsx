const React = require('react');

// =====================================
const Shrinky = React.createClass({
    // -----------------------------
    render: function(){
        const { shrink } = this.state;
        const modifier = shrink ? 'shrink' : 'full';
        const className = `shrinky shrinky--${modifier}`;

        // When shrink is true, only the first child will remain visible.

        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    },

    // -----------------------------
    getDefaultProps: function(){
        return { limit: 100 };
    },

    // -----------------------------
    getInitialState: function(){
        const { limit } = this.props;
        return { shrink: document.body.scrollTop > limit };
    },

    // -----------------------------
    componentDidMount: function(){
        document.addEventListener('scroll', this.checkScroll);
    },

    // -----------------------------
    checkScroll: function(ev){
        const { limit } = this.props;
        const shrink = document.body.scrollTop > limit;
        if (this.state.shrink !== shrink) {
            this.setState({ shrink });
        }
    }
});

module.exports = Shrinky;