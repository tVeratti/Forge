// =====================================
const Login = (props) => {
    return (
        <div className='account__login'>
            <div className='panel'>
                <h4>Log In</h4>
                <form action='/Account/ExternalLogin' method='post'>
                    <button type='submit' name='Provider' value='Google'>Google+</button>
                </form>
            </div>
        </div>
    );
};

module.exports = Login;