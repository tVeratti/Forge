const React = require('react');

const Button = require('./Button.jsx');

// =======================================================
const Nav = React.createClass({
    // RENDER ==========================
    render: function () {
        // Toggle Menu Open/Closed Styles
        const siteUlClass = this.state.siteOpen ? 'open' : undefined;
        const accountUlClass = this.state.accountOpen ? 'open' : undefined;
        
        const toggleSiteHandler = this.toggleList.bind(this, 'siteOpen');
        const toggleAccountHandler = this.toggleList.bind(this, 'accountOpen');

        const toggleSiteClassName = 'toggle nav__menu t-'// + siteUlClass;
        const toggleAccountClassName = 'toggle nav__user t-'// + accountUlClass;

        // Arrow decoration template
        const arrowNode = <span className="arrow" />;

        // RENDER ==========================
        return (
		    <div>

			    {/* Site Navigation Menu */}
			    <div id="nav-site" className="nav-group">
				    <Button className={toggleSiteClassName} onClick={toggleSiteHandler} />
	                <ul className={siteUlClass}>
	            	    {arrowNode}
                        <li><a href="/">Home</a></li>
					    <li><a href="/Games">Games</a></li>
	                </ul>
                </div>

                {/* Account Navigation Menu */}
                <div id="nav-account" className="nav-group">
                    <Button className={toggleAccountClassName} onClick={toggleAccountHandler} />
                    <ul className={accountUlClass}>
                        {arrowNode}
                        <li><a href="/Account">{this.props.UserName || 'Log In'}</a></li>
                    </ul>
                </div>

            </div>
        );
    },

    // ---------------------------------------
    getInitialState: function(){
        return {
            siteOpen: false,
            accountOpen: false,
            isSticky: false
        }
    },

    // ---------------------------------------
    toggleList: function(stateKey){
        var self = this;

        var state = {};
        state[stateKey] = !this.state[stateKey];

        // Bind document click to hide the menu if elsewhere is clicked
        if (state[stateKey]){
            document.addEventListener('click', self.hideAll);
        }

        // NOTE: This forces the other key to undefined (falsy)
        this.replaceState(state);
    },

    // ---------------------------------------
    hideAll: function(event){
        // Don't continue if a toggle was clicked
        if (event.target.className.indexOf("toggle") > -1) return;

        // Hide both menus
        this.setState({
            siteOpen: false,
            accountOpen: false
        });

        // Remove click listener
        document.removeEventListener('click', this.hideAll);
    }
});

module.exports = Nav;