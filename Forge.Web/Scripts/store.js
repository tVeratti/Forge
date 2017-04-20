const rootReducer = combineReducers({
    core:           coreReducer,
    common:         commonReducer,
    library:        libraryReducer,
    designer:       designerReducer
});

const store = createStore(
    rootReducer,
    applyMiddleware(
        ReduxDebounce,
        ReduxThunk.default
    )
);