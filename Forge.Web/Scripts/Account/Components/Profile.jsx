const React = require('react');
const { connect } = require('react-redux');

const actions = require('Account/Actions.js');

const Button = require('Common/Components/Button.jsx');

// Presentation
// =====================================
const __Profile = React.createClass({
    // -----------------------------
    render: function(){
        const { user } = this.props.account;

        return (
            <div className='account__profile'>
                <h1>Profile</h1>
                <h2>{user.name} ({user.email})</h2>

                <div className='separator' />

                <form action='/Account/LogOut' method='post'>
                    <button type='submit'>Log Out</button>
                </form>

                <div className='separator' />

                <div className='account__details'>
                    <div className='column'>
                        {/* Games */}
                        <div className='panel'>
                            <h4>My Games</h4>
                            <Button>Create New Game</Button>
                        </div>

                        {/* Characters */}
                        <div className='panel'>
                            <h4>My Characters</h4>
                            <Button>Create New Character</Button>
                        </div>
                    </div>

                    <div className='column'>
                        {/* Friends */}
                        <div className='panel'>
                            <h4>Friends</h4>
                            <Button>Find Friends</Button>
                        </div>
                    </div>
                </div>
                
            </div>
        );
    },

    // -----------------------------
    componentDidMount: function(){
        const { dispatch, id } = this.props;
        dispatch(actions.fetchUser(id));
    }
});

// Container
// =====================================
const Profile = connect(
    state => { return { account: state.account }}
)(__Profile);

module.exports = Profile;