const { Provider, connect } = require('react-redux');
const store = require('Store.js');

const Summary =     require('./Summary.jsx');
const Controls =    require('./Controls.jsx');
const List =        require('./List.jsx');

// <Library />
// =====================================
const __Library = (props) => {
    const { loading } = props.library;

    return (
        <div className='library'>
            {/* Summary & Controls */}
            <div className='section section--secondary'>
                { loading && <div className='loading-bar' />}
                <Summary />
                <Controls />
            </div>

            <List />
        </div>
    );
};

// =====================================
// Container
// =====================================
const Library = connect(
    state => { return { ...state } }
)(__Library);

// Root
// =====================================
Library.Provider = () => {
    return (
        <Provider store={store}>
            <Library />
        </Provider>
    );
};

module.exports = Library;
