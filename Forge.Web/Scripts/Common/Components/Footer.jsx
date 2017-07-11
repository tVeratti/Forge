const React = require('react');

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
                TatianaVeratti@gmail.com @TatianaVeratti
            </div>
        );
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
    }
});

module.exports = Footer;