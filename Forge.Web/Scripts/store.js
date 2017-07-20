const { combineReducers, createStore, applyMiddleware } = require('redux');

const reduxThunk = require('redux-thunk').default;

const core =     require('Core/Reducer.js');
const common =   require('Common/Reducer.js');
const builder =  require('Builder/Reducer.js');
const library =  require('Library/Reducer.js');
const designer = require('Designer/Reducer.js');
const account =  require('Account/Reducer.js')

const rootReducer = combineReducers({
    core,
    common,
    builder,
    library,
    designer,
    account
});

const store = createStore(
    rootReducer,
    applyMiddleware(
        reduxThunk
    )
);

module.exports = store;