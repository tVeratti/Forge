// =======================================================
// <Footer />
// =======================================================
const Footer = React.createClass({
    render: function(){
        const navLinks = this.renderLinks([
            { text: 'Games', url: '/Games' },
            { text: 'Designer', url: '/Designer' },
            { text: 'About', url: '/About' },
            { text: 'Account', url: '/Account'}
        ]);

        return (
            <div className='footer' ref='footer'>
                <ul className='footer__nav'>{navLinks}</ul>
                <div className='footer__message' />
            </div>
        );
    },

    // ----------------------------
    componentDidMount: function(){
        this.contentNode = document.getElementById('content');
        this.footerNode = this.refs.footer;

        // Every (resizeTime) milliseconds, calculate the footer's height.
        // This is to compensate for window and body size changes.
        this.interval = window.setInterval(this.updateSize, 300);
        this.updateSize();
    },

    // ----------------------------
    renderLinks: function(links){
        return links.map(l => {
            return (
                <li key={l.text}>
                    <a className='footer__link' href={l.url}>{l.text}</a>
                </li>
            );
        });
    },

    // ----------------------------
    updateSize: function(){
        // If specified by the application,
        // use JS to calculate the height of the footer
        // and add it as a negative margin to the content
        // element, allowing for the footer to be stickied
        // to the bottom when not enough content is
        // present to put it at the bottom.
        if (this.contentNode && this.footerNode) {
            // Check that there has been a change in footer height (window width)
            // or wrapper height (content). 
            var wrapperHeight = this.contentNode.offsetHeight;
            var footerHeight = this.footerNode.offsetHeight;

            var sizeWrapperDelta = Math.abs(wrapperHeight - (this.wrapperHeight || 0));
            var sizeFooterDelta = Math.abs(footerHeight - (this.footerHeight || 0));

            if (sizeWrapperDelta > 1 || sizeFooterDelta > 1){
                
                // Update the wrapper's margin to push the footer
                // to the bottom of the page.
                var margin = this.contentNode.style.marginBottom;
                var newMargin = footerHeight;
                this.contentNode.style.marginBottom = newMargin - 1 + 'px';

                this.wrapperHeight = wrapperHeight;
                this.footerHeight = footerHeight;
            }
        }
    }
});