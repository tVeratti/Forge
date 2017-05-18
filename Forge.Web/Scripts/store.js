const rootReducer = combineReducers({
    core:           coreReducer,
    common:         commonReducer,
    library:        libraryReducer,
    designer:       designerReducer,
    builder:        builderReducer
});

const store = createStore(
    rootReducer,
    applyMiddleware(
        ReduxDebounce,
        ReduxThunk.default
    )
);