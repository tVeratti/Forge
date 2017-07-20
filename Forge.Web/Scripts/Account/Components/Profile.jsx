const React = require('react');
const { connect } = require('react-redux');

const actions = require('Account/Actions.js');

// Presentation
// =====================================
const __Profile = React.createClass({
    // -----------------------------
    render: function(){
        const { user } = this.props.account;

        return (
            <div className='account__profile'>
                <div className='account__user'>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                </div>

                <form action='/Account/LogOut' method='post'>
                    <button type='submit'>Log Out</button>
                </form>
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