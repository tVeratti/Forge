// =====================================
const Login = (props) => {
    return (
        <div className='account__login'>
            <form action='/Account/ExternalLogin' method='post'>
                <button type='submit' name='Provider' value='Google'>Google+</button>
            </form>
        </div>
    );
};

module.exports = Login;