const { combineReducers, createStore, applyMiddleware } = require('redux');

const reduxThunk = require('redux-thunk').default;

const coreReducer =     require('Core/Reducer.js');
const commonReducer =   require('Common/Reducer.js');
const libraryReducer =  require('Library/Reducer.js');
const designerReducer = require('Designer/Reducer.js');
const builderReducer =  require('Builder/Reducer.js');

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
        reduxThunk
    )
);

module.exports = store;