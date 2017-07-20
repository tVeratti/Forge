const React = require('react');
const { Provider, connect} = require('react-redux');

const store = require('Store.js');
const actions = require('Account/Actions.js');

const Profile = require('./Profile.jsx');
const Login = require('./Login.jsx');

// Presentation
// =====================================
const __Account = React.createClass({
    // -----------------------------
    render: function () {
        const { id } = this.props;
        const view = id ? <Profile /> : <Login />;

        return (
            <div className='account'>
                {view}
            </div>
        );
    },

    componentWillMount: function(){
        const { dispatch, id, email } = this.props;
        dispatch(actions.setUser(id, email));
    }

});

// Container
// =====================================
const Account = connect()(__Account);

// Root
// =====================================
Account.Provider = (props) => (
    <Provider store={store}>
        <Account {...props} />
    </Provider>
);

module.exports = Account;