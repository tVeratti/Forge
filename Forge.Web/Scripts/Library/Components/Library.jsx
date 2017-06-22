// =====================================
// <Library />
// =====================================
const __Library = (props) => {
    const { loading } = props.library;

    return (
        <div className='library'>
            {/* Summary & Controls */}
            <div className='section section--secondary'>
                { loading && <div className='loading-bar' />}
                <Library.Summary />
                <Library.Controls />
            </div>

            <Library.List />
        </div>
    );
};

// =====================================
// Container
// =====================================
const Library = connect(
    state => { return { ...state } }
)(__Library);

// =====================================
// Root
// =====================================
Library.Provider = () => {
    return (
        <Provider store={store}>
            <Library />
        </Provider>
    );
};
