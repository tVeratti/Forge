// =====================================
// <Library />
// =====================================
const Library = () => {
    return (
        <div className='library'>
            <Library.Summary />
            <Library.Controls />
            <Library.List />
        </div>
    );
};

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
