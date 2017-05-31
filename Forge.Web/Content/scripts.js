'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Primary NameSpace
// =====================================
var Forge = {
    settings: {},
    lifeCycle: {},
    components: {
        controls: {}
    }
};

var user = {};

// Vendor
// =====================================
var _Redux = Redux,
    combineReducers = _Redux.combineReducers,
    applyMiddleware = _Redux.applyMiddleware,
    createStore = _Redux.createStore;
var _ReactRedux = ReactRedux,
    Provider = _ReactRedux.Provider,
    connect = _ReactRedux.connect;


var incrementName = function incrementName(list, name, activeIndex) {}
// const pattern = /(\(\d+\))/g;
// const getNum = (a) => {
//     return +(a.Name.match(pattern) || ['(0)'])[0]
//         .replace('(', '')
//         .replace(')', '');
// }

// let nextNum = -1;
// list.map(getNum)
//     .sort()
//     .some((num, i) => {
//         const exists = list.filter(a => a.Name.indexOf(`(${num})`) !== -1)[0];
//         if (!exists) {
//             nextNum = num;
//             return true;
//         }
//     });

// if (existingMatch) {
//     // Get an added extension if it already exists
//     let num = 1;
//     const matches = existingMatch.Name.match(pattern);
//     const numMatch = matches
//         ? matches[matches.length - 1] || '(0)'
//         : '(0)';

//     num = numMatch


//     num = +num + 1;
//     name = name.replace(numMatch, '');
//     name += `(${num})`;
// }

// return name;


// Action Types
// =====================================
// --------------------------------
;var REQUEST_GAME = 'REQUEST_GAME';
var RECEIVE_GAME = 'RECEIVE_GAME';
var CREATE_ITEM = 'CREATE_ITEM';
var UPDATE_ITEM = 'UPDATE_ITEM';

var UPDATE_DEFINITION = 'UPDATE_DEFINITION';
var ADD_SETTING = 'ADD_SETTING';

var UPDATE_RULE = 'UPDATE_RULE';
var UPDATE_TAG = 'UPDATE_TAG';

var CATEGORIES = {
    TAGS: 'Tags',
    RULES: 'Rules',
    DEFINITIONS: 'Definitions'
};

var coreActions = {

    // Constants
    // =====================================
    // --------------------------------
    api: {
        FETCH_GAME: '/Core/Get'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestGame: function requestGame() {
        return { type: REQUEST_GAME };
    },
    receiveGame: function receiveGame(game) {
        return { type: RECEIVE_GAME, game: game };
    },

    // --------------------------------
    fetchGame: function fetchGame(id) {
        var _this = this;

        return function (dispatch) {
            // Show loading indication.
            dispatch(_this.requestGame());

            // Fetch games from database with state filters.
            $.get(_this.api.FETCH_GAME, { id: id }).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this.receiveGame(result));
            });
        };
    },

    // --------------------------------
    createItem: function createItem() {
        return function (dispatch, getState) {
            var _getState = getState(),
                designer = _getState.designer,
                core = _getState.core;

            dispatch({
                type: CREATE_ITEM,
                category: designer.tab,
                index: core[designer.tab].length
            });
        };
    },

    // --------------------------------
    addSetting: function addSetting(index, setting) {
        return { type: ADD_SETTING, index: index, setting: setting };
    },

    // --------------------------------
    updateTag: function updateTag(model) {
        return this.updateItem(model, CATEGORIES.TAGS);
    },

    // --------------------------------
    updateRule: function updateRule(model) {
        return this.updateItem(model, CATEGORIES.RULES);
    },

    // --------------------------------
    updateDefinition: function updateDefinition(model) {
        return this.updateItem(model, CATEGORIES.DEFINITIONS);
    },

    // --------------------------------
    updateItem: function updateItem(model, category) {
        return function (dispatch, getState) {
            var _getState2 = getState(),
                designer = _getState2.designer,
                core = _getState2.core;

            var index = designer.index === -1 ? model.index : designer.index;

            dispatch({ type: UPDATE_ITEM, category: category, index: index, model: model });
        };
    }
};

// LifeCycle Management
// =====================================
Forge.lifeCycle = new LifeCycle();

function LifeCycle() {
    // Stages
    // --------------------------------
    var _stages = {
        wait: 'Wait',
        init: 'Initialize',
        initAndUpdate: 'InitializeAndUpdate',
        update: 'Update'
    };

    // Order
    // --------------------------------
    var _order = [_stages.wait, _stages.init, _stages.initAndUpdate, _stages.update];

    // --------------------------------
    var _isActive = function _isActive(settingStage, stage) {
        if (!store) return false;

        var init = _stages.init,
            update = _stages.update;

        var index = _order.indexOf(settingStage);

        switch (stage) {
            case init:
                return index === 1 || index === 2;
            case update:
                return index === 2 || index === 3;
            default:
                return false;
        }
    };

    return {
        stages: _stages,
        order: _order,
        isActive: _isActive
    };
};
var initialCoreState = {
    loading: true,
    saving: false,

    updateIds: [],

    Game: {},
    Rules: [],
    Definitions: [],
    Settings: [],
    Tags: [],
    Controls: [],
    Groups: []
};

// =====================================
function coreReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialCoreState;
    var action = arguments[1];


    var nextState = _extends({}, state);

    switch (action.type) {
        // --------------------------------
        case REQUEST_GAME:
            nextState.loading = true;
            break;

        // --------------------------------
        case RECEIVE_GAME:

            nextState = _extends({}, nextState, action.game);

            nextState.Definitions.forEach(function (d, i) {
                d.index = i;

                // Combine Settings & Rules, then sort by Priority.
                d.Settings = Forge.utilities.sortSettings([].concat(_toConsumableArray(d.Settings), _toConsumableArray(Forge.utilities.getRules(d.Tags, nextState.Rules))));
            });

            // nextState.Definitions.forEach(d => {
            //     d.Children = nextState.Definitions.filter(c => {
            //         return c.Settings.filter(s => s.D)
            //     })
            // });

            nextState.loading = false;
            nextState.saving = false;
            break;

        // --------------------------------
        case CREATE_ITEM:
            // New item with temporary Id
            var newItem = {
                Name: 'New ' + action.category.slice(0, -1),
                TempId: 't-' + Math.random()
            };

            nextState[action.category] = [].concat(_toConsumableArray(nextState[action.category]), [newItem]);

            break;

        // --------------------------------
        case UPDATE_ITEM:
            var items = [].concat(_toConsumableArray(state[action.category]));

            items[action.index] = _extends({}, items[action.index], action.model);

            nextState[action.category] = items;

            // let updateIds = [];
            // switch(action.category){
            //     // Rules
            //     case CATEGORIES.RULES: 
            //         updateIds = state.Definitions
            //             .filter(d => {
            //                 return d.Settings.filter(s => {
            //                     return s.TagId === action.model.TagId 
            //                         || s.SettingId === action.model.SettingId;
            //                 })[0];
            //             })
            //             .map(d => d.Id); break;

            //     // Update dependent children.
            //     case CATEGORIES.DEFINITIONS: 
            //         state.Definitions.forEach(d => {
            //             updateIds = [ ...updateIds, ...(d.Children || []) ];
            //         });
            //         break;
            // }

            // nextState.updateIds = updateIds;

            break;

        // --------------------------------
        case ADD_SETTING:
            var definitions = [].concat(_toConsumableArray(state.Definitions));

            var definition = _objectWithoutProperties(definitions[action.index], []);

            // The setting becomes a new DefinitionSetting - it has
            // relationship values that are specific to the way this
            // Definition object implements the Setting.


            var definitionSetting = _objectWithoutProperties(action.setting, []);

            // Only add the setting if the new setting is unique.


            var settingExists = (definition.Settings || []).filter(function (s) {
                return s.Name === action.setting.Name;
            })[0];

            if (!settingExists) {
                definition.Settings = [].concat(_toConsumableArray(definition.Settings || []), [definitionSetting]);
            }

            // Upate the state array with the updated object.
            definitions[action.index] = definition;
            nextState.Definitions = definitions;
            break;
    }

    return nextState;
}
// Definition Settings
// =====================================
Forge.settings = {
    // --------------------------------
    Minimum: function Minimum(value, setting) {
        if (isNaN(value)) value = 0;
        return Math.max(+value, +setting);
    },

    // --------------------------------
    Maximum: function Maximum(value, setting) {
        if (isNaN(value)) value = 0;
        return Math.min(+value, +setting);
    },

    // --------------------------------
    Default: function Default(value, setting) {
        return value || setting;
    }
};
// Core Functions
// =====================================
Forge.utilities = {
    // -----------------------------
    getRules: function getRules(tags, rules) {
        tags = tags || [];
        rules = rules || [];

        var tagIds = tags.map(function (t) {
            return +t.Id;
        });

        // Merge rules into this list, adding the property IsRule = true.
        var definitionRules = rules.filter(function (r) {
            return tagIds.indexOf(+r.TagId) > -1;
        });

        return definitionRules.map(function (rule) {
            // Return as a new DefinitionSettingModel
            return _extends({}, rule, {
                Id: rule.SettingId + '-' + rule.TagId
            });
        });
    },

    // -----------------------------
    sortSettings: function sortSettings(settings) {
        return (settings || []).sort(function (a, b) {
            if (!!a.TagId && !b.TagId) return -1;
            if (!!a.TagId && !b.TagId) return 1;
            if (a.Priority > b.Priority) return 1;
            if (a.Priority < b.Priority) return -1;

            return 0;
        });
    }
};

// General
// =====================================
// --------------------------------
var debounceAction = function debounceAction(thunk, key) {
    var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;

    return Object.assign(thunk, { meta: { debounce: { time: time, key: key } } });
};

// --------------------------------
var contains = function contains(array, item) {
    return array.indexOf(item) !== -1;
};

// --------------------------------
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// --------------------------------
var sortBy = function sortBy(arr, prop) {
    return arr.sort(function (a, b) {
        if (a[prop] > b[prop]) return 1;
        if (a[prop] < b[prop]) return -1;
        return 0;
    });
};

var initialCommonState = {
    genres: [{ id: 1, value: 'Fantasy' }, { id: 2, value: 'Sci-Fi' }]
};

function commonReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialCommonState;
    var action = arguments[1];

    return state;
    // let nextState = Object.assign({}, state);

    // switch(action.type){
    // }

    // return nextState;
}
// Action Types
// =====================================
// --------------------------------
var REQUEST_GAMES = 'REQUEST_GAMES';
var RECEIVE_GAMES = 'RECEIVE_GAMES';
var CREATE_GAME = 'CREATE_GAME';
var DELETE_GAME = 'DELETE_GAME';
var FILTER_GAMES = 'FILTER_GAMES';

var libraryActions = {

    // Constants
    // =====================================
    // --------------------------------
    filterTypes: {
        PERMISSION: 'Permission',
        KEYWORD: 'Keyword',
        GENRE: 'Genre'
    },

    filters: {
        SHOW_PUBLIC: 'SHOW_PUBLIC',
        SHOW_SHARED: 'SHOW_SHARED',
        SHOW_MINE: 'SHOW_MINE'
    },

    api: {
        FETCH_GAMES: '/Games/GetGames',
        CREATE_GAME: '/Games/CreateGame',
        DELETE_GAME: '/Games/DeleteGame/'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestGames: function requestGames() {
        return { type: REQUEST_GAMES };
    },

    // --------------------------------
    receiveGames: function receiveGames(games) {
        return { type: RECEIVE_GAMES, games: games };
    },

    // --------------------------------
    fetchGames: function fetchGames() {
        var _this2 = this;

        var thunk = function thunk(dispatch, getState) {
            // Show loading indication.
            dispatch(_this2.requestGames());

            // Get the current filters from store state.
            var filters = getState().library.filters;

            console.log(_this2.api.FETCH_GAMES);

            // Fetch games from database with state filters.
            $.post(_this2.api.FETCH_GAMES, filters).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this2.receiveGames(result));
            });
        };

        return debounceAction(thunk, 'fetchGames', 500);
    },

    // --------------------------------
    createGame: function createGame(name) {
        var _this3 = this;

        return function (dispatch) {
            // Show loading indication.
            dispatch(_this3.requestGames());

            // Create game and retrieve a new list of games
            // (including the newly created one)
            $.post(_this3.api.CREATE_GAME, { name: name }).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this3.receiveGames(result));
            });
        };
    },

    // --------------------------------
    deleteGame: function deleteGame(id) {
        var _this4 = this;

        return function (dispatch) {
            $.post(api.DELETE_GAME, id).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this4.receiveGames(result));
            });
        };
    },

    // --------------------------------
    filterGames: function filterGames(key, value) {
        var _this5 = this;

        return function (dispatch) {
            // Update store filters.
            dispatch({ type: FILTER_GAMES, key: key, value: value });

            // Fetch games with new filters.
            dispatch(_this5.fetchGames());
        };
    }
};
var initialLibraryState = {
    games: [],
    filters: {
        Permission: 'SHOW_PUBLIC'
    }
};

function libraryReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialLibraryState;
    var action = arguments[1];


    var nextState = _extends({}, state);

    switch (action.type) {
        // --------------------------------
        case REQUEST_GAMES:
            nextState.isLoading = true;
            break;

        // --------------------------------
        case RECEIVE_GAMES:
            nextState.games = action.games;
            nextState.isLoading = false;
            break;

        // --------------------------------
        case FILTER_GAMES:
            var filters = _extends({}, nextState.filters);
            filters[action.key] = action.value;
            nextState.filters = filters;
            break;
    }

    return nextState;
}
// Action Types
// =====================================
// --------------------------------


var builderActions = {

    // Constants
    // =====================================
    // --------------------------------
    api: {},

    // Action Creators
    // =====================================
    // --------------------------------
    requestDesigner: function requestDesigner() {
        return { type: REQUEST_DESIGNER };
    }

};
var initialBuilderState = {
    loading: true,
    saving: false
};

function builderReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialBuilderState;
    var action = arguments[1];


    var nextState = Object.assign({}, state);

    switch (action.type) {}

    return nextState;
}
// Action Types
// =====================================
// --------------------------------
var REQUEST_DESIGNER = 'REQUEST_DESIGNER';
var RECEIVE_DESIGNER = 'RECEIVE_DESIGNER';
var BACK = 'BACK';
var CHANGE_TAB = 'CHANGE_TAB';
var NAVIGATE = 'NAVIGATE';
var SELECT_LIST_ITEM = 'SELECT_LIST_ITEM';
var ACTIVATE_TAG = 'ACTIVATE_TAG';
var SAVE_MODEL = 'SAVE_MODEL';
var SAVE_TAG = 'SAVE_TAG';
var SAVE_DEFINITION = 'SAVE_DEFINITION';

var designerActions = {

    // Constants
    // =====================================
    // --------------------------------
    api: {
        FETCH_DESIGNER: '/Designer/GetDesigner',
        SAVE_RULE: '/Core/SaveRule',
        SAVE_TAG: '/Core/SaveTag',
        SAVE_DEFINITION: '/Core/SaveDefinition'
    },

    // Action Creators
    // =====================================
    // --------------------------------
    requestDesigner: function requestDesigner() {
        return { type: REQUEST_DESIGNER };
    },

    // --------------------------------
    receiveDesigner: function receiveDesigner(designer) {
        return { type: RECEIVE_DESIGNER, designer: designer };
    },

    // --------------------------------
    fetchDesigner: function fetchDesigner(id) {
        var _this6 = this;

        return function (dispatch) {
            // Show loading indication.
            dispatch(_this6.requestDesigner());

            // Fetch games from database with state filters.
            $.get(_this6.api.FETCH_DESIGNER, { id: id }).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this6.receiveDesigner(result));
            });
        };
    },

    // --------------------------------
    back: function back() {
        return { type: BACK };
    },

    // --------------------------------
    changeTab: function changeTab(tab) {
        return { type: CHANGE_TAB, tab: tab };
    },

    // --------------------------------
    selectListItem: function selectListItem(index) {
        return { type: SELECT_LIST_ITEM, index: index };
    },

    // --------------------------------
    navigate: function navigate(tab, index) {
        return { type: SELECT_LIST_ITEM, tab: tab, index: index };
    },

    // --------------------------------
    activateTag: function activateTag(tagId) {
        return { type: ACTIVATE_TAG, tagId: tagId };
    },

    // --------------------------------
    saveModel: function saveModel() {
        var _this7 = this;

        var thunk = function thunk(dispatch, getState) {

            dispatch({ type: SAVE_MODEL });

            // Get the current state data.

            var _getState3 = getState(),
                core = _getState3.core,
                designer = _getState3.designer;

            var tab = designer.tab,
                index = designer.index;

            var gameId = core.Game.Id;
            var model = _extends({}, core[tab][index]);

            var api = void 0;
            switch (designer.tab) {
                case 'Tags':
                    api = _this7.api.SAVE_TAG;break;
                case 'Rules':
                    api = _this7.api.SAVE_RULE;break;
                case 'Definitions':
                    api = _this7.api.SAVE_DEFINITION;
                    model.Settings = model.Settings.filter(function (s) {
                        return !s.TagId;
                    });
                    break;
            }

            // Send model data to database.
            $.post(api, { model: model, gameId: gameId }).then(function (response) {
                return JSON.parse(response);
            }).then(function (id) {
                // Check if an id was sent back from the controller -
                // this indicates if an item was inserted or updated.
                if (id) {
                    // A new item was created, so we need
                    // to capture the new Id and update the model.
                    model.Id = id;
                    dispatch(coreActions.updateItem(model, tab));
                }
            });
        };

        return debounceAction(thunk, 'saveModel', 500);
    }
};
var initialDesignerState = {
    loading: true,
    saving: false,
    tab: 'Menu',
    listTab: 'List',
    index: -1,
    itemHistory: []
};

function designerReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialDesignerState;
    var action = arguments[1];


    var nextState = Object.assign({}, state);

    if (action.tab || action.index) {
        // Push a new history item for the user to navigate back to.
        nextState.itemHistory = [{
            tab: state.tab,
            index: state.index
        }].concat(_toConsumableArray(state.itemHistory));
    }

    switch (action.type) {
        // --------------------------------
        case BACK:
            if (state.itemHistory.length) {
                var backState = state.itemHistory[0];
                nextState = Object.assign({}, nextState, backState);
                nextState.itemHistory.shift();
            }
            break;

        // --------------------------------
        case CHANGE_TAB:
            nextState.tab = action.tab;
            nextState.index = -1;
            nextState.activeTagId = null;
            break;

        // --------------------------------
        case SELECT_LIST_ITEM:
        case CREATE_ITEM:
            if (state.saving) return nextState;
            nextState.tab = action.tab || action.category || state.tab;
            nextState.index = action.index;
            nextState.activeTagId = null;
            break;

        // --------------------------------
        case ACTIVATE_TAG:
            nextState.activeTagId = action.tagId;
            break;

        // --------------------------------
        case SAVE_MODEL:
            if (state.saving) return nextState;
            nextState.saving = true;
            break;

        case UPDATE_ITEM:
            nextState.saving = false;
    }

    return nextState;
}
// User Preference Store
// ================================================
// Store user preferences in localStorage AND Database.
// Fetch first from localStorage, fallback to DB.
var userStore = new UserPreferenceStore();

function UserPreferenceStore() {
    var self = this;

    // An array of fields that the user wishes
    // to see on their designer preview tiles
    // (Defaults)
    self.previewFields = {
        loaded: false,
        tags: ['Name'],
        rules: ['TagName', 'SettingName', 'Value'],
        definitions: ['Name', 'Tags']
    };

    return self;
}
// =====================================
// Presentation
// =====================================
var __Builder = React.createClass({
    displayName: '__Builder',

    // -----------------------------
    render: function render() {

        return React.createElement('div', { className: 'builder' });
    },

    // -----------------------------
    componentWillMount: function componentWillMount() {
        // Model comes from C# -
        // Set data into store with dispatch.
        var _props = this.props,
            dispatch = _props.dispatch,
            id = _props.id;

        dispatch(coreActions.fetchGame(id));
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var game = nextProps.Game;
        if (game && game.Name) document.title = game.Name + ' - Forge | Builder';
    }
});

// =====================================
// Container
// =====================================
var Builder = connect(function (state) {
    return _extends({}, state.core);
})(__Builder);

// =====================================
// Root
// =====================================
Builder.Provider = function (props) {
    return React.createElement(
        Provider,
        { store: store },
        React.createElement(Builder, props)
    );
};

// =====================================
// Presentation
// =====================================
Builder._Groups = React.createClass({
    displayName: '_Groups',

    // -----------------------------
    render: function render() {
        var core = this.props.core;

        var definitionNodes = core.Definitions.map(function (d) {
            return React.createElement(Forge.Definition, { key: d.Id, model: d });
        });

        return React.createElement(
            'div',
            { className: 'builder__groups' },
            definitionNodes
        );
    }
});

// =====================================
// Container
// =====================================
Builder.Groups = connect(function (state) {
    return _extends({}, state);
})(Builder._Groups);

// =====================================
// <Banner />
// =====================================
var Banner = function Banner(_ref) {
    var header = _ref.header,
        children = _ref.children,
        _ref$icon = _ref.icon,
        icon = _ref$icon === undefined ? 'info' : _ref$icon;


    var className = 'banner banner--' + icon;

    return React.createElement(
        'div',
        { className: className },
        React.createElement('div', { className: 'banner__icon', 'aria-hidden': 'true' }),
        React.createElement(
            'div',
            { className: 'banner__content' },
            header && React.createElement(
                'h5',
                null,
                header
            ),
            React.createElement(
                'p',
                { className: 'summary' },
                children
            )
        )
    );
};
// =====================================
// <Checkbox />
// =====================================
var Checkbox = function Checkbox(_ref2) {
    var id = _ref2.id,
        label = _ref2.label,
        name = _ref2.name;
    return React.createElement(
        'span',
        { className: 'checkbox' },
        React.createElement('input', { className: 'checkbox__input', id: id, type: 'checkbox', name: name || id }),
        React.createElement(
            'label',
            { className: 'checkbox__label', htmlFor: id },
            label
        )
    );
};

var Expandable = React.createClass({
    displayName: 'Expandable',

    // -----------------------------
    render: function render() {
        var _this8 = this;

        var _props2 = this.props,
            children = _props2.children,
            header = _props2.header;
        var open = this.state.open;


        var toggleOpen = function toggleOpen() {
            return _this8.setState({ open: !open });
        };
        var title = open ? 'Collapse' : 'Expand';

        var className = 'expandable expandable--' + (open ? 'open' : 'closed');

        return React.createElement(
            'div',
            { className: className },
            React.createElement(
                'div',
                { className: 'expandable__header' },
                React.createElement(
                    'div',
                    { className: 'expandable__button' },
                    React.createElement('button', { className: 'expandable__icon', onClick: toggleOpen, title: title })
                ),
                React.createElement(
                    'label',
                    { className: 'expandable__label' },
                    header
                )
            ),
            open && React.createElement(
                'div',
                { className: 'expandable__content' },
                children
            )
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        return { open: false };
    }
});
// =====================================
// <Field />
// =====================================
var Field = function Field(_ref3) {
    var props = _objectWithoutProperties(_ref3, []);

    var inputNode = void 0;
    if (!props.children) {
        inputNode = props.options ? React.createElement(Select, props) : React.createElement('input', props);
    }

    return React.createElement(
        'div',
        { className: 'field' },
        React.createElement(
            'label',
            { className: 'field__label', htmlFor: props.id },
            props.label
        ),
        React.createElement(
            'span',
            { className: 'field__value' },
            props.children || inputNode
        )
    );
};
// =======================================================
// <Footer />
// =======================================================
var Footer = React.createClass({
    displayName: 'Footer',

    render: function render() {
        var navLinks = this.renderLinks([{ text: 'Games', url: '/Games' }, { text: 'Designer', url: '/Designer' }, { text: 'About', url: '/About' }, { text: 'Account', url: '/Account' }]);

        return React.createElement(
            'div',
            { className: 'footer', ref: 'footer' },
            React.createElement(
                'ul',
                { className: 'footer__nav' },
                navLinks
            ),
            React.createElement('div', { className: 'footer__message' })
        );
    },

    // ----------------------------
    componentDidMount: function componentDidMount() {
        this.contentNode = document.getElementById('content');
        this.footerNode = this.refs.footer;

        // Every (resizeTime) milliseconds, calculate the footer's height.
        // This is to compensate for window and body size changes.
        this.interval = window.setInterval(this.updateSize, 300);
        this.updateSize();
    },

    // ----------------------------
    renderLinks: function renderLinks(links) {
        return links.map(function (l) {
            return React.createElement(
                'li',
                { key: l.text },
                React.createElement(
                    'a',
                    { className: 'footer__link', href: l.url },
                    l.text
                )
            );
        });
    },

    // ----------------------------
    updateSize: function updateSize() {
        // If specified by the application,
        // use JS to calculate the height of the footer
        // and add it as a negative margin to the content
        // element, allowing for the footer to be stickied
        // to the bottom when not enough content is
        // present to put it at the bottom.
        if (this.contentNode && this.footerNode) {
            // Check that there has been a change in footer height (window width)
            // or wrapper height (content). 
            var wrapperHeight = this.contentNode.offsetHeight;
            var footerHeight = this.footerNode.offsetHeight;

            var sizeWrapperDelta = Math.abs(wrapperHeight - (this.wrapperHeight || 0));
            var sizeFooterDelta = Math.abs(footerHeight - (this.footerHeight || 0));

            if (sizeWrapperDelta > 1 || sizeFooterDelta > 1) {

                // Update the wrapper's margin to push the footer
                // to the bottom of the page.
                var margin = this.contentNode.style.marginBottom;
                var newMargin = footerHeight;
                this.contentNode.style.marginBottom = newMargin - 1 + 'px';

                this.wrapperHeight = wrapperHeight;
                this.footerHeight = footerHeight;
            }
        }
    }
});
// =====================================
// Presentation
// =====================================
var __GenreSelect = function __GenreSelect(_ref4) {
    var props = _objectWithoutProperties(_ref4, []);

    var id = 'genre-select';
    return React.createElement(
        'span',
        { className: 'genre-select' },
        React.createElement(
            'label',
            { className: 'genre-select__label', htmlFor: id },
            props.label
        ),
        React.createElement(
            'select',
            { className: 'genre-select__input', id: id, onChange: props.onChange },
            props.genreNodes
        )
    );
};

// =====================================
// Container
// =====================================
var GenreSelect = connect(function (state) {
    return {
        genreNodes: state.common.genres.map(function (o) {
            return React.createElement(
                'option',
                _extends({ key: o.id }, o),
                o.value
            );
        })
    };
})(__GenreSelect);
// =======================================================
// <Nav />
// =======================================================
var Nav = React.createClass({
    displayName: 'Nav',

    // RENDER ==========================
    render: function render() {
        // Toggle Menu Open/Closed Styles
        var siteUlClass = this.state.siteOpen ? 'open' : undefined;
        var accountUlClass = this.state.accountOpen ? 'open' : undefined;

        var toggleSiteHandler = this.toggleList.bind(this, 'siteOpen');
        var toggleAccountHandler = this.toggleList.bind(this, 'accountOpen');

        var toggleSiteClassName = 'toggle fa fa-navicon t-'; // + siteUlClass;
        var toggleAccountClassName = 'toggle fa fa-user t-'; // + accountUlClass;

        // Arrow decoration template
        var arrowNode = React.createElement('span', { className: 'arrow' });

        // RENDER ==========================
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { id: 'nav-site', className: 'nav-group' },
                React.createElement('span', { className: toggleSiteClassName, onClick: toggleSiteHandler }),
                React.createElement(
                    'ul',
                    { className: siteUlClass },
                    arrowNode,
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'a',
                            { href: '/' },
                            'Home'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'a',
                            { href: '/Games' },
                            'Games'
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { id: 'nav-account', className: 'nav-group' },
                React.createElement('span', { className: toggleAccountClassName, onClick: toggleAccountHandler }),
                React.createElement(
                    'ul',
                    { className: accountUlClass },
                    arrowNode,
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            'a',
                            { href: '/Account' },
                            this.props.UserName || 'Log In'
                        )
                    )
                )
            )
        );
    },

    // ---------------------------------------
    getInitialState: function getInitialState() {
        return {
            siteOpen: false,
            accountOpen: false,
            isSticky: false
        };
    },

    // ---------------------------------------
    toggleList: function toggleList(stateKey) {
        var self = this;

        var state = {};
        state[stateKey] = !this.state[stateKey];

        // Bind document click to hide the menu if elsewhere is clicked
        if (state[stateKey]) {
            document.addEventListener('click', self.hideAll);
        }

        // NOTE: This forces the other key to undefined (falsy)
        this.replaceState(state);
    },

    // ---------------------------------------
    hideAll: function hideAll(event) {
        // Don't continue if a toggle was clicked
        if (event.target.className.indexOf("toggle") > -1) return;

        // Hide both menus
        this.setState({
            siteOpen: false,
            accountOpen: false
        });

        // Remove click listener
        document.removeEventListener('click', this.hideAll);
    }
});
// =====================================
// <Radio />
// =====================================
var Radio = function Radio(_ref5) {
    var id = _ref5.id,
        label = _ref5.label,
        name = _ref5.name;
    return React.createElement(
        'span',
        { className: 'radio' },
        React.createElement('input', { className: 'radio__input', id: id, type: 'radio', name: name }),
        React.createElement(
            'label',
            { className: 'radio__label', htmlFor: id },
            label
        )
    );
};
// =====================================
// <Select />
// =====================================
var Select = function Select(_ref6) {
    var props = _objectWithoutProperties(_ref6, []);

    var options = props.options || [];

    // Map options data into option elements.
    var optionNodes = options.map(function (option, index) {
        var id = option.Id || option.id;
        var label = option.Name || option.Label;
        return React.createElement(
            'option',
            { key: id + '-' + index, value: id },
            label
        );
    });

    return React.createElement(
        'select',
        { className: 'select__input', id: props.id, onChange: props.onChange, defaultValue: props.defaultValue },
        optionNodes
    );
};
// =====================================
// <Sortable />
// =====================================
var Sortable = React.createClass({
    displayName: 'Sortable',

    // -----------------------------
    render: function render() {
        var className = 'sortable';
        if (this.state.dragging) className += ' sortable--dragging';

        var list = this.props.list;

        var dragNodes = list.map(this.renderDraggable);
        var lastNode = this.state.initialIndex !== list.length ? this.renderSlot(list.length) : null;

        return React.createElement(
            'ul',
            { className: className },
            dragNodes,
            lastNode
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        return {
            dragging: false,
            index: -1
        };
    },

    // -----------------------------
    renderDraggable: function renderDraggable(content, index) {
        var renderHandler = this.props.renderHandler;
        var initialIndex = this.state.initialIndex;


        var className = 'sortable__item';
        var itemProps = {
            key: 'item-' + (content.Id || content.Name),
            onDragOver: this.itemHover.bind(this, index)
        };

        var slotNode = initialIndex !== index ? this.renderSlot(index) : null;

        if (!content.DisableDrag) {
            if (initialIndex === index) className += ' sortable__item--dragging';

            // HTML 5 Drag & Drop Events
            itemProps = _extends({}, itemProps, {
                draggable: true,
                onDragStart: this.beginDrag.bind(this, index),
                onDragEnd: this.endDrag
            });
        } else className += ' sortable__item--disabled';

        return [slotNode, React.createElement(
            'li',
            _extends({}, itemProps, { className: className }),
            content
        )];
    },

    // -----------------------------
    renderSlot: function renderSlot(index) {
        var dropHandler = this.slotDrop.bind(this, index);
        var hoverHandler = this.slotHover.bind(this, index);

        var className = 'sortable__slot';
        if (index === this.state.index) className += ' sortable__slot--active';

        var key = 'slot-' + index;

        return React.createElement('li', { key: key, className: className, onDragOver: hoverHandler, onDrop: dropHandler });
    },

    // -----------------------------
    beginDrag: function beginDrag(index, ev) {
        this.setState({
            dragging: true,
            initialIndex: index,
            index: index
        });
    },

    // -----------------------------
    endDrag: function endDrag(ev) {
        if (this.state.initialIndex !== this.state.index) {
            this.slotDrop(this.state.index, ev);
        } else {
            this.setState({
                dragging: false,
                index: -1,
                initialIndex: -1
            });
        }
    },

    // -----------------------------
    slotHover: function slotHover(index, ev) {
        ev.preventDefault();
        this.setState({ index: index });
    },

    // -----------------------------
    itemHover: function itemHover(index, ev) {
        ev.preventDefault();
        this.calculateActive(index, ev);
    },

    // -----------------------------
    calculateActive: function calculateActive(index, ev) {

        // Determine if the user is hovering over the top
        // or bottm half of the element in order to know
        // where the drop should be shown (above/below).
        var $target = $(ev.target);
        var itemHeight = $target.outerHeight();
        var itemOffset = $target.offset();

        var y = ev.pageY - itemOffset.top;

        if (itemHeight / 2 > y) {
            // Hovering top half of item.
            this.setState({ index: index });
        } else {
            // Hovering bottom half of item.
            this.setState({ index: index + 1 });
        }
    },

    // -----------------------------
    slotDrop: function slotDrop(newIndex, ev) {
        ev.preventDefault();
        var _state = this.state,
            initialIndex = _state.initialIndex,
            index = _state.index;
        var _props3 = this.props,
            list = _props3.list,
            onChange = _props3.onChange;


        var handler = function handler(arr, i, i2) {
            var newList = [].concat(_toConsumableArray(arr));
            var moved = newList.splice(i, 1, '$RMV$')[0];
            newList.splice(i2, 0, moved);
            return newList.filter(function (l) {
                return l !== '$RMV$';
            });
        };

        this.setState({
            dragging: false,
            index: -1,
            initialIndex: -1
        });

        if (onChange) onChange(initialIndex, newIndex, handler);
    }
});
// =====================================
// <Tab />
// =====================================
var Tab = React.createClass({
    displayName: 'Tab',

    // ----------------------------
    render: function render() {
        var props = this.props;

        return React.createElement(
            'span',
            { className: 'tab' },
            React.createElement('input', { className: 'tab__input', id: props.id, type: 'radio', name: props.name, onChange: props.onChange, ref: 'input' }),
            React.createElement(
                'label',
                { className: 'tab__label', htmlFor: props.id },
                props.label
            )
        );
    },

    // ----------------------------
    componentDidMount: function componentDidMount() {
        // If the default value should be checked,
        // set default value to checked = true.
        if (this.props.checked) {
            this.refs.input.checked = true;
        }
    },

    // ----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var checked = nextProps.checked;
        this.refs.input.checked = checked;
    }
});
// --------------------------------------------------
// <Forge.Definition />

// - Settings
// - ControlName
// - Value
// --------------------------------------------------
Forge.__Definition = React.createClass({
    displayName: '__Definition',

    // -----------------------------
    render: function render() {
        var model = this.props.model;
        var ControlName = model.ControlName,
            Control = model.Control;

        var controlName = ControlName || Control || 'Number';
        var controlProps = {
            Model: model,
            onChange: this.valueChange
        };

        // Dynamically create the component based on Control name.
        var controlNode = React.createElement(Forge.components.controls[controlName], controlProps);

        return React.createElement(
            'div',
            { className: 'definition' },
            React.createElement(
                'p',
                { className: 'definition__name' },
                model.Name
            ),
            React.createElement(
                'p',
                { className: 'definition__control' },
                controlNode
            )
        );
    },

    // -----------------------------
    componentWillMount: function componentWillMount() {
        // Trigger Lifecycle: Initialize
        var stages = Forge.lifeCycle.stages;

        this.valueChange(this.props.model.Value, null, stages.init);
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var core = nextProps.core,
            model = nextProps.model;
        //if (core.updateIds.indexOf(model.Id) === -1 && model.Value === this.props.model.Value) return;

        // Trigger Lifecycle: Update.Only do this when something other
        // than the internal value has changed (ie: Settings).

        var stages = Forge.lifeCycle.stages;

        this.valueChange(nextProps.model.Value, null, stages.update, nextProps);
    },

    // -----------------------------
    computeSettings: function computeSettings(props) {
        var model = props.model,
            core = props.core;


        return [].concat(_toConsumableArray(model.Settings || []), _toConsumableArray(Forge.utilities.getRules(model.Tags, core.Rules)));
    },

    // -----------------------------
    valueChange: function valueChange(value, ev) {
        var lifecycle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Forge.lifeCycle.stages.update;
        var props = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.props;
        var model = props.model,
            core = props.core,
            dispatch = props.dispatch;

        // Only include settings that match the current lifecycle

        var computedSettings = this.computeSettings(props || this.props).filter(function (s) {
            return Forge.lifeCycle.isActive(s.LifeCycle, lifecycle);
        });

        // Order by Priority / IsRule
        Forge.utilities.sortSettings(computedSettings)
        // Apply all settings
        .forEach(function (s) {
            return value = Forge.settings[s.SettingName || s.Name](value, s.Value);
        });

        if (value !== props.model.Value) {
            dispatch(coreActions.updateDefinition(_extends({}, model, {
                Value: value
            })));
        };
    }
});

// =====================================
// Container
// =====================================
Forge.Definition = connect(function (state) {
    return { core: state.core };
})(Forge.__Definition);
// -------------------------------------------------
// <Designer />
// 
// =====================
// |       a   b       |
// =====================
// | 1 |     2     | 3 |
// |   |           |   |
// |   |           |   |
// =====================
// a: Designer.Summary
// b: Designer.Tabs
// 1: Designer.Definitions
// 2: Designer.Stage
// 3: Designer.Settings
//
// --------------------------------------------------
// =====================================
// Presentation
// =====================================
var __Designer = React.createClass({
    displayName: '__Designer',

    // -----------------------------
    render: function render() {
        var designer = this.props.designer;


        return React.createElement(
            'div',
            { className: 'designer' },
            React.createElement(Designer.Summary, null),
            React.createElement(Designer.Tabs, null),
            React.createElement(
                'div',
                { className: 'designer__views overlay__anchor' },
                designer.loading && React.createElement('div', { className: 'overlay' }),
                React.createElement(Designer.List, null),
                React.createElement(Designer.Stage, null)
            )
        );
    },

    // -----------------------------
    componentWillMount: function componentWillMount() {
        // Model comes from C# -
        // Set data into store with dispatch.
        var _props4 = this.props,
            dispatch = _props4.dispatch,
            id = _props4.id;

        dispatch(coreActions.fetchGame(id));
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var game = nextProps.core.Game;
        if (game && game.Name) document.title = game.Name + ' - Forge | Designer';
    }
});

// =====================================
// Container
// =====================================
var Designer = connect(function (state) {
    return _extends({}, state);
})(__Designer);

// =====================================
// Root
// =====================================
Designer.Provider = function (props) {
    return React.createElement(
        Provider,
        { store: store },
        React.createElement(Designer, props)
    );
};

// =====================================
// Presentation
// =====================================
Designer.__List = React.createClass({
    displayName: '__List',

    // -----------------------------
    render: function render() {
        var listNodes = this.renderList();
        var actionNodes = this.renderActions();

        var className = ' designer__list';
        if (!listNodes) className += ' designer__list--empty';
        if (this.state.open) className += ' designer__list--open';else className += ' designer__list--closed';

        return React.createElement(
            'div',
            { className: className },
            actionNodes,
            React.createElement(
                'ul',
                { className: 'designer__list-items' },
                listNodes
            )
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        return { open: true, listTab: 'List' };
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (nextProps.tab !== this.props.tab && nextProps.selectedItem == null) {
            this.setState({ open: true, listTab: 'List' });
        }
    },

    // -----------------------------
    renderList: function renderList() {
        var _this9 = this;

        var _props$designer = this.props.designer,
            tab = _props$designer.tab,
            index = _props$designer.index;
        var listTab = this.state.listTab;


        switch (listTab) {
            case 'Settings':
                return React.createElement(Designer.Settings, null);
            case 'Search':
                return React.createElement(Designer.Search, null);
        }

        var list = this.props.core[tab];
        if (!Array.isArray(list)) return;

        // Map list items from the store model into nodes.
        var nodes = list.map(function (item, i) {

            // Unique identifier for the VDOM.
            var key = tab + '-' + i + '-' + (item.Id || item.Name || item.TempId);

            // ClassName modifiers.
            var className = 'designer__list-item';
            if (i === index) className += ' designer__list-item--selected';

            // Click Handler.
            var onClick = function onClick() {
                _this9.setState({ open: false });
                _this9.props.dispatch(designerActions.selectListItem(i));
            };

            return React.createElement(
                'li',
                { key: key, className: className },
                React.createElement(
                    'button',
                    { className: 'button button--primary', onClick: onClick },
                    item.Name
                )
            );
        });

        // Unshift the ADD button to the top of the list.
        nodes.unshift(React.createElement(
            'li',
            { key: 'add', className: 'designer__list-item' },
            React.createElement(
                'button',
                { className: 'button button--tertiary designer__add', onClick: this.new, title: 'New' },
                'New'
            )
        ));

        return nodes;
    },

    // -----------------------------
    renderActions: function renderActions() {
        var _this10 = this;

        var tab = this.props.designer.tab;
        var _state2 = this.state,
            open = _state2.open,
            listTab = _state2.listTab;


        var toggleText = open ? 'Hide' : 'Show';
        var toggle = function toggle() {
            return _this10.setState({ open: !open });
        };

        var buttons = ['List', 'Search'];
        if (tab === 'Definitions') buttons.push('Settings');

        var miniButtons = buttons.map(function (b) {
            var onClick = _this10.changeList.bind(_this10, b);
            var className = 'button icon icon--' + b.toLowerCase();
            if (b === listTab) className += ' button--active';

            return React.createElement('button', { key: b, className: className, title: b, onClick: onClick });
        });

        return React.createElement(
            'div',
            { className: 'designer__list-actions' },
            React.createElement('button', { className: 'button button--transparent designer__toggle', onClick: toggle, title: toggleText }),
            React.createElement(
                'div',
                { className: 'designer__mini-buttons' },
                miniButtons
            )
        );
    },

    // -----------------------------
    changeList: function changeList(tab) {
        var open = this.state.open;
        if (!open) open = true;else if (tab === this.state.listTab) open = !open;

        this.setState({ listTab: tab, open: open });
    },

    // -----------------------------
    new: function _new() {
        this.props.dispatch(coreActions.createItem());
    }
});

// =====================================
// Container
// =====================================
Designer.List = connect(function (state) {
    return _extends({}, state);
})(Designer.__List);
// =====================================
// Presentation
// =====================================
Designer._Menu = React.createClass({
    displayName: '_Menu',

    // -----------------------------
    render: function render() {

        return React.createElement(
            'div',
            { className: 'designer__menu' },
            React.createElement(
                'div',
                { className: 'designer__tiles' },
                React.createElement(
                    'button',
                    { className: 'designer__tile' },
                    'Help'
                ),
                React.createElement(
                    'button',
                    { className: 'designer__tile' },
                    'Preview'
                )
            )
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Menu = connect(function (state) {
    return _extends({}, state.designer);
})(Designer._Menu);

// =====================================
// Presentation
// =====================================
Designer._Preview = React.createClass({
    displayName: '_Preview',

    // -----------------------------
    render: function render() {
        return React.createElement(
            'div',
            { className: 'designer__preview' },
            React.createElement(Builder.Groups, null)
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Preview = connect(function (state) {
    return _extends({}, state);
})(Designer._Preview);

// -------------------------------------------------
// <Designer.__Search />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Search = React.createClass({
    displayName: '__Search',


    // -----------------------------
    render: function render() {
        var _state3 = this.state,
            all = _state3.all,
            filter = _state3.filter;

        var filterLower = filter.toLowerCase();

        var listNodes = filter ? all.filter(function (x) {
            return contains((x.Name || '').toLowerCase(), filterLower);
        }) : [];

        listNodes = sortBy(listNodes, 'Name').map(this.renderItem);

        return React.createElement(
            'div',
            null,
            React.createElement('input', { value: filter, onInput: this.inputHandler }),
            React.createElement(
                'ul',
                null,
                listNodes
            )
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        var all = this.concatCoreArrays();

        return { all: all, filter: '' };
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var all = this.concatCoreArrays();
        this.setState({ all: all });
    },

    // -----------------------------
    concatCoreArrays: function concatCoreArrays() {
        var core = this.props.core;


        return [].concat(_toConsumableArray(this.mapTabItems(core.Rules, CATEGORIES.RULES)), _toConsumableArray(this.mapTabItems(core.Tags, CATEGORIES.TAGS)), _toConsumableArray(this.mapTabItems(core.Definitions, CATEGORIES.DEFINITIONS)));
    },

    // -----------------------------
    mapTabItems: function mapTabItems(items, tab) {
        return items.map(function (item, index) {
            return _extends({}, item, { index: index, tab: tab });
        });
    },

    // -----------------------------
    renderItem: function renderItem(item) {
        var _props5 = this.props,
            dispatch = _props5.dispatch,
            designer = _props5.designer;

        var key = item.tab + '-' + (item.Id || item.TempId || item.Name);

        // ClassName modifiers.
        var className = 'designer__list-item';
        if (item.index === designer.index) className += ' designer__list-item--selected';

        // Click Handler.
        var onClick = function onClick() {
            return dispatch(designerActions.navigate(item.tab, item.index));
        };

        return React.createElement(
            'li',
            { key: key, className: className },
            React.createElement(
                'button',
                { className: 'button button--primary', onClick: onClick },
                item.Name
            )
        );
    },

    // -----------------------------
    inputHandler: function inputHandler(evt) {
        var value = evt.target.value;

        this.setState({ filter: value });
    }
});

// =====================================
// Container
// =====================================
Designer.Search = connect(function (state) {
    return _extends({}, state);
})(Designer.__Search);

// -------------------------------------------------
// <Designer.__Settings />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Settings = React.createClass({
    displayName: '__Settings',


    // -----------------------------
    render: function render() {
        var settingNodes = this.renderSettingsList();

        return React.createElement(
            'ul',
            null,
            settingNodes
        );
    },

    // -----------------------------
    renderSettingsList: function renderSettingsList() {
        var _this11 = this;

        var _props6 = this.props,
            settings = _props6.settings,
            core = _props6.core,
            designer = _props6.designer;

        var activeItem = core.Definitions[designer.index];
        if (!activeItem) return;

        var activeSettings = (activeItem.Settings || []).map(function (s) {
            return s.Name;
        });

        return settings.map(function (s) {

            var clickHandler = _this11.addSetting.bind(_this11, s);
            var className = 'setting';
            var disabled = false;
            if (contains(activeSettings, s.Name)) {
                className += ' setting--active';
                disabled = true;
            }

            return React.createElement(
                'li',
                { key: s.Name, className: className },
                React.createElement(
                    'button',
                    { onClick: clickHandler, disabled: disabled },
                    React.createElement('span', { className: 'setting__icon' }),
                    React.createElement(
                        'span',
                        null,
                        s.Name
                    )
                )
            );
        });
    },

    // -----------------------------
    addSetting: function addSetting(setting) {
        var _props7 = this.props,
            dispatch = _props7.dispatch,
            index = _props7.index;

        dispatch(coreActions.addSetting(index, setting));
    }
});

// =====================================
// Container
// =====================================
Designer.Settings = connect(function (state) {
    return _extends({
        settings: state.core.Settings || [],
        index: state.designer.index
    }, state);
})(Designer.__Settings);

// -------------------------------------------------
// <Designer.Stage />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Stage = React.createClass({
    displayName: '__Stage',

    instructions: {
        Tags: 'A Tag can be used to logically group Settings and Definitions. Tags can be used to apply Rules to many Definitions at once (ie: Give all Definitions with the Tag of "Attribute" a Minimum value of 1).',
        Rules: 'Rules are pre-defined Settings that can be applied to many definitions using Tags.',
        Definitions: 'Definitions are all of the small bits of information that describe a character. These are the building blocks of a charater builder and how it behaves.'
    },

    // -----------------------------
    render: function render() {
        var _props$designer2 = this.props.designer,
            tab = _props$designer2.tab,
            index = _props$designer2.index,
            itemHistory = _props$designer2.itemHistory;

        var list = this.props.core[tab] || [];
        var selectedItem = list[index];
        var isMenu = tab === 'Menu';

        var editView = isMenu ? React.createElement(Designer.Menu, null) : this.renderStage();

        var headerNode = '\xA0';
        if (!isMenu && selectedItem) headerNode = this.renderSelectedHeader();

        var uniqueId = selectedItem ? selectedItem.Id || selectedItem.TempId || selectedItem.Name : '';

        var className = 'designer__stage stage stage--' + tab.toLowerCase();
        var stageKey = tab + '-' + index + '-' + uniqueId;

        var menuDisabled = !selectedItem;
        var instructions = this.instructions[tab];

        return React.createElement(
            'div',
            { className: className, key: stageKey },
            React.createElement(
                'h3',
                null,
                headerNode
            ),
            React.createElement(
                'div',
                { className: 'stage__menu' },
                React.createElement(
                    'button',
                    { className: 'button button--transparent stage__back', onClick: this.back, disabled: !itemHistory.length },
                    'Back'
                ),
                React.createElement(
                    'button',
                    { className: 'button button--transparent stage__save', onClick: this.save, disabled: menuDisabled },
                    'Save'
                ),
                React.createElement(
                    'button',
                    { className: 'button button--transparent stage__delete', disabled: menuDisabled },
                    'Delete'
                )
            ),
            React.createElement(
                'div',
                { className: 'stage__workspace' },
                instructions && React.createElement(
                    Banner,
                    null,
                    instructions
                ),
                React.createElement('div', { className: 'separator separator--small' }),
                editView
            )
        );
    },

    // -----------------------------
    renderStage: function renderStage() {
        var _props8 = this.props,
            designer = _props8.designer,
            dispatch = _props8.dispatch,
            core = _props8.core;

        var selectedItem = this.getSelectedItem();

        if (!selectedItem && designer.tab !== 'Preview') {

            var createItem = function createItem() {
                return dispatch(coreActions.createItem());
            };
            var createButton = React.createElement(
                'button',
                { className: 'button button--tertiary designer__add', onClick: createItem },
                'Create one'
            );

            if (!core[designer.tab] || !core[designer.tab].length) {
                // No items exist in this list, prompt the user to create one...
                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'p',
                        null,
                        'No ',
                        designer.tab,
                        ' exist for this game yet!'
                    ),
                    createButton
                );
            } else {
                // Nothing selected yet
                return React.createElement(
                    'div',
                    null,
                    'Select an item to edit or',
                    createButton
                );
            }
        }

        // Return a specific editing stage component.
        switch (designer.tab) {
            case CATEGORIES.TAGS:
                return React.createElement(Designer.EditTag, null);
            case CATEGORIES.RULES:
                return React.createElement(Designer.EditRule, null);
            case CATEGORIES.DEFINITIONS:
                return React.createElement(Designer.EditDefinition, null);
            case 'Preview':
                return React.createElement(Designer.Preview, null);
            default:
                return React.createElement(Designer.Menu, null);
        }
    },

    // -----------------------------
    renderSelectedHeader: function renderSelectedHeader() {
        var designer = this.props.designer;

        var selectedItem = this.getSelectedItem();

        return React.createElement(
            'div',
            null,
            React.createElement(
                'span',
                { className: 'breadcrumb' },
                designer.tab
            ),
            React.createElement(
                'span',
                { className: 'emphasis' },
                selectedItem && selectedItem.Name
            )
        );
    },

    // -----------------------------
    save: function save() {
        this.props.dispatch(designerActions.saveModel());
    },

    // -----------------------------
    back: function back() {
        this.props.dispatch(designerActions.back());
    },

    // -----------------------------
    getSelectedItem: function getSelectedItem() {
        var _props9 = this.props,
            designer = _props9.designer,
            core = _props9.core;

        return (core[designer.tab] || [])[designer.index];
    }
});

// =====================================
// Container
// =====================================
Designer.Stage = connect(function (state) {
    return _extends({}, state);
})(Designer.__Stage);

// -------------------------------------------------
// <Designer.Summary />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Summary = React.createClass({
    displayName: '__Summary',

    render: function render() {
        var game = this.props.Game;
        var createdAgo = moment.utc(game.CreatedDate).fromNow();

        return React.createElement(
            'div',
            { className: 'section section--summary designer__summary' },
            this.props.loading && React.createElement(
                'h2',
                null,
                'Loading...'
            ),
            React.createElement(
                'h1',
                null,
                game.Name || '\xA0'
            ),
            React.createElement(
                'p',
                null,
                React.createElement(
                    'b',
                    null,
                    game.CreatedByUserName
                ),
                ' ',
                createdAgo
            ),
            React.createElement('div', { className: 'separator' })
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Summary = connect(function (state) {
    return _extends({}, state.core);
})(Designer.__Summary);

// -------------------------------------------------
// <Designer.Tabs />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Tabs = React.createClass({
    displayName: '__Tabs',

    views: ['Menu', 'Tags', 'Rules', 'Definitions', 'Preview'],

    // -----------------------------
    render: function render() {
        var tabNodes = this.views.map(this.renderTab);

        return React.createElement(
            'div',
            { className: 'tab-group' },
            tabNodes
        );
    },

    // -----------------------------
    renderTab: function renderTab(label, index) {
        var _this12 = this;

        // Active Tab Check
        var checked = label === this.props.tab || undefined;

        // Click Handler
        // Dispatch action to store and update filter for tab.
        var onClick = function onClick() {
            return _this12.props.dispatch(designerActions.changeTab(label));
        };

        return React.createElement(Tab, { key: label, id: label, label: label, onChange: onClick, name: 'designer-tabs', checked: checked });
    }
});

// =====================================
// Container
// =====================================
Designer.Tabs = connect(function (state) {
    return { tab: state.designer.tab };
})(Designer.__Tabs);

// =====================================
// <Library />
// =====================================
var Library = function Library() {
    return React.createElement(
        'div',
        { className: 'library' },
        React.createElement(Library.Summary, null),
        React.createElement(Library.Controls, null),
        React.createElement(Library.List, null)
    );
};

// =====================================
// Root
// =====================================
Library.Provider = function () {
    return React.createElement(
        Provider,
        { store: store },
        React.createElement(Library, null)
    );
};

// =====================================
// Presentation
// =====================================
Library.__Controls = React.createClass({
    displayName: '__Controls',

    // --------------------------------
    render: function render() {

        return React.createElement(
            'div',
            { className: 'library__controls' },
            React.createElement(Library.Filters, null),
            React.createElement(
                'div',
                { className: 'library__create' },
                React.createElement('input', { ref: 'input' }),
                React.createElement(
                    'button',
                    { onClick: this.createGame },
                    'Create'
                )
            )
        );
    },

    // --------------------------------
    createGame: function createGame() {
        var gameInput = this.refs.input;
        this.props.dispatch(libraryActions.createGame(gameInput.value));
        gameInput.value = '';
    }
});

// =====================================
// Container
// =====================================
Library.Controls = connect()(Library.__Controls);

// =====================================
// Presentation
// =====================================
Library.__Filters = React.createClass({
    displayName: '__Filters',

    // --------------------------------
    render: function render() {
        var permissionNodes = this.renderPermissionTabs();
        var keywordNode = this.renderKeywordInput();
        var genreNode = this.renderGenreSelect();

        return React.createElement(
            'div',
            { className: 'library__filters' },
            React.createElement(
                'div',
                null,
                permissionNodes
            ),
            React.createElement(
                'div',
                { className: 'library__other-filters' },
                keywordNode,
                React.createElement(GenreSelect, null)
            )
        );
    },

    // --------------------------------
    renderPermissionTabs: function renderPermissionTabs() {
        var _this13 = this;

        // Get action types from libraryActions.
        var _libraryActions$filte = libraryActions.filters,
            SHOW_PUBLIC = _libraryActions$filte.SHOW_PUBLIC,
            SHOW_MINE = _libraryActions$filte.SHOW_MINE,
            SHOW_SHARED = _libraryActions$filte.SHOW_SHARED;
        var PERMISSION = libraryActions.filterTypes.PERMISSION;

        // Prepare some options for permission filters.

        var permissionTypes = [{ id: SHOW_PUBLIC, label: 'Public' }, { id: SHOW_MINE, label: 'My Games' }, { id: SHOW_SHARED, label: 'Shared with Me' }];

        // Render permission options into Tab nodes.
        var tabNodes = permissionTypes.map(function (permission) {
            var tabHandler = _this13.changeFilter.bind(_this13, PERMISSION, permission.id);
            var checked = permission.id === _this13.props.library.filters[PERMISSION];
            console.log('state', _this13.props.library.filters[PERMISSION]);
            return React.createElement(Tab, _extends({ key: permission.id, name: 'access-tab', onChange: tabHandler, checked: checked }, permission));
        });

        return React.createElement(
            'div',
            { className: 'library__permissions tab-group' },
            tabNodes
        );
    },

    // --------------------------------
    renderKeywordInput: function renderKeywordInput() {
        var KEYWORD = libraryActions.filterTypes.KEYWORD;

        var inputHandler = this.changeFilter.bind(this, KEYWORD);

        return React.createElement('input', { className: 'library__keyword', onInput: inputHandler });
    },

    // --------------------------------
    renderGenreSelect: function renderGenreSelect() {
        var GENRE = libraryActions.filterTypes.GENRE;

        var changeHandler = this.changeFilter.bind(this, GENRE);

        return React.createElement(GenreSelect, { onChange: changeHandler });
    },

    // --------------------------------
    changeFilter: function changeFilter(key, event) {
        var value = event.target ? event.target.value : event;

        // Update store state and request games with new filters.
        this.props.dispatch(libraryActions.filterGames(key, value));
    }
});

// =====================================
// Container
// =====================================
Library.Filters = connect(function (state) {
    return { library: state.library };
})(Library.__Filters);

// =====================================
// <Library.Game />
// =====================================
Library.Game = function (_ref7) {
    var game = _objectWithoutProperties(_ref7, []);

    return React.createElement(
        'li',
        { className: 'library__game' },
        React.createElement(
            'a',
            { href: '/Designer?id=' + game.Id },
            React.createElement(
                'p',
                null,
                game.Name
            ),
            React.createElement(
                'p',
                null,
                game.CreatedByUserName
            )
        )
    );
};
// =====================================
// Presentation
// =====================================
Library.__List = React.createClass({
    displayName: '__List',

    // --------------------------------
    render: function render() {
        var gameNodes = this.renderGames();

        return React.createElement(
            'ul',
            { className: 'library__list' },
            gameNodes
        );
    },

    // --------------------------------
    componentDidMount: function componentDidMount() {
        this.props.dispatch(libraryActions.fetchGames());
    },

    // --------------------------------
    renderGames: function renderGames() {
        return this.props.games.map(function (game) {
            return React.createElement(Library.Game, _extends({ key: game.Id }, game));
        });
    }
});

// =====================================
// Container
// =====================================
Library.List = connect(function (state) {
    return _extends({}, state.library);
})(Library.__List);

// =====================================
// <Library.Summary />
// =====================================
Library.Summary = function (_ref8) {
    var game = _objectWithoutProperties(_ref8, []);

    return React.createElement(
        'div',
        { className: 'section section--summary library__summary' },
        React.createElement('div', { className: 'separator separator--medium' })
    );
};
Forge.components.controls.Number = React.createClass({
    displayName: 'Number',

    // -----------------------------
    render: function render() {
        var _props10 = this.props,
            Model = _props10.Model,
            Value = _props10.Value;


        var value = Model.Value || Value;
        if (isNaN(value)) value = 0;

        return React.createElement('input', { type: 'number', value: value, onChange: this.change });
    },

    // -----------------------------
    getDefaultProps: function getDefaultProps() {
        return { Model: {} };
    },

    // -----------------------------
    change: function change(ev) {
        var onChange = this.props.onChange;
        var value = +ev.target.value;
        if (typeof onChange === 'function') {
            onChange(value, ev);
        }
    }
});
Forge.components.controls.Text = React.createClass({
    displayName: 'Text',

    render: function render() {
        return React.createElement(
            'div',
            null,
            'Text Control'
        );
    }
});
// -------------------------------------------------
// <Designer.EditDefinition />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__EditDefinition = React.createClass({
    displayName: '__EditDefinition',


    // -----------------------------
    render: function render() {
        var _this14 = this;

        var _props11 = this.props,
            designer = _props11.designer,
            core = _props11.core;


        var selectedItem = core.Definitions[designer.index];

        var update = function update(prop) {
            return _this14.updateModel.bind(_this14, prop);
        };

        return React.createElement(
            'div',
            { className: 'edit edit--definition' },
            React.createElement(
                'div',
                { className: 'panel' },
                React.createElement(
                    'h4',
                    null,
                    'General'
                ),
                React.createElement(
                    'div',
                    { className: 'field-group' },
                    React.createElement(Field, { label: 'Name',
                        id: 'name',
                        defaultValue: selectedItem.Name,
                        onChange: update('Name') }),
                    React.createElement(Field, { label: 'Group',
                        id: 'group',
                        defaultValue: selectedItem.GroupId,
                        onChange: update('GroupId'),
                        options: core.Groups }),
                    React.createElement(Field, { label: 'Control',
                        id: 'control',
                        defaultValue: selectedItem.ControlId,
                        onChange: update('ControlId'),
                        options: core.Controls })
                )
            ),
            React.createElement(
                'div',
                { className: 'panel' },
                React.createElement(
                    'h4',
                    null,
                    'Tags'
                ),
                React.createElement(
                    'p',
                    { className: 'summary' },
                    'Tags can be used to apply global rules, which will add settings with predfined values.'
                ),
                React.createElement(Definition__Tags, null)
            ),
            React.createElement(
                'div',
                { className: 'panel' },
                React.createElement(
                    'h4',
                    null,
                    'Settings'
                ),
                React.createElement(
                    'p',
                    { className: 'summary' },
                    'These settings change the behavior of this definition on the character builder. These will be applied to the definition in order from top to bottom (priority). ',
                    React.createElement(
                        'b',
                        null,
                        'Drag a setting to re-order its priority level.'
                    )
                ),
                React.createElement('div', { className: 'separator  separator--small' }),
                React.createElement(Definition__Settings, null)
            ),
            React.createElement(Forge.Definition, { model: selectedItem })
        );
    },

    // -----------------------------
    updateModel: function updateModel(prop, ev) {
        var _props12 = this.props,
            designer = _props12.designer,
            core = _props12.core,
            dispatch = _props12.dispatch;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        model[prop] = ev.target.value;

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.EditDefinition = connect(function (state) {
    return _extends({}, state);
})(Designer.__EditDefinition);

// =====================================
// Presentation
// =====================================
var __Definition__Settings = React.createClass({
    displayName: '__Definition__Settings',

    // -----------------------------
    render: function render() {

        var nestedSettings = this.nestRules().map(this.renderSetting);

        return React.createElement(
            'div',
            { className: 'definition__settings' },
            React.createElement(Sortable, { list: nestedSettings, onChange: this.updateOrder })
        );
    },

    // -----------------------------
    renderSetting: function renderSetting(setting, index) {
        var activeTagId = this.props.designer.activeTagId;

        var removeHandler = this.removeSetting.bind(this, setting);

        // If a Tag is being hovered over, we want the related setting
        // to display with some emphasis and allow the user to see which
        // settings are added by whic tags.
        var className = 'definition__setting';
        var removeNode = void 0;
        if (activeTagId === setting.TagId) className += ' definition__setting--active';
        if (setting.TagId) className += ' definition__rule';else removeNode = React.createElement('span', { className: 'definition__setting-remove', onClick: removeHandler });

        var controlNode = setting.TagId ? setting.Value : this.renderControl(setting, index);

        // This is the main control node that can modify the setting value.
        var primaryNodes = React.createElement(
            'div',
            { className: 'field' },
            React.createElement(
                'label',
                { className: 'field__label' },
                setting.Name
            ),
            React.createElement(
                'span',
                { className: 'field__value' },
                controlNode
            ),
            removeNode
        );

        if (setting.Rules && setting.Rules.length) {
            // Map relevant rules underneath this setting so that
            // they can be displayed as children of this setting.
            var ruleNodes = setting.Rules.map(function (r) {
                var className = 'definition__nested-rule';
                if (activeTagId === r.TagId) className += ' definition__nested-rule--active';
                return React.createElement(
                    'li',
                    { key: r.Name, className: className },
                    React.createElement(
                        Field,
                        { label: r.Name },
                        r.Value
                    )
                );
            });

            return React.createElement(
                'div',
                { key: setting.Id || setting.SettingId, className: className },
                React.createElement(
                    Expandable,
                    { header: primaryNodes },
                    React.createElement(
                        'ul',
                        { className: 'definition__overrides field-group' },
                        ruleNodes
                    )
                )
            );
        } else {
            // Basic single setting row (no associated rules).
            return React.createElement(
                'div',
                { key: setting.Id, className: className },
                primaryNodes
            );
        }
    },

    // -----------------------------
    renderControl: function renderControl(setting, index) {
        var controlName = setting.ControlName || setting.Control || 'Number';
        var controlProps = {
            Value: setting.Value || undefined,
            onChange: this.valueChange.bind(this, setting.Id)
        };

        // Dynamically create the component based on Control name.
        return React.createElement(Forge.components.controls[controlName], controlProps);
    },

    // -----------------------------
    removeSetting: function removeSetting(setting) {
        var _props13 = this.props,
            dispatch = _props13.dispatch,
            core = _props13.core,
            designer = _props13.designer;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        // Update the value of one individual setting.


        var settings = [].concat(_toConsumableArray(model.Settings || []));
        var index = model.Settings.indexOf(setting);
        settings.splice(index, 1);
        model.Settings = settings;

        dispatch(coreActions.updateDefinition(model));
    },

    // -----------------------------
    nestRules: function nestRules() {
        var _props14 = this.props,
            core = _props14.core,
            designer = _props14.designer;

        var selectedItem = core.Definitions[designer.index];
        var itemSettings = selectedItem.Settings || [];

        // Get all Rules based on the tags on this item.
        var rules = Forge.utilities.getRules(selectedItem.Tags || [], core.Rules);
        var settingIds = itemSettings.map(function (s) {
            return s.Id;
        });

        // Nest Rules that share the same setting.
        itemSettings.forEach(function (s) {
            s.Rules = rules.filter(function (r) {
                return s.TagId ? r.SettingId === s.SettingId && r.TagId !== s.TagId : r.SettingId === s.Id;
            });
        });

        return Forge.utilities.sortSettings(itemSettings)
        // Only show 1 rule per setting (rest are nested).
        .filter(function (s) {
            if (s.SettingId) {
                var index = settingIds.indexOf(s.SettingId);
                if (index === -1) settingIds.push(s.SettingId);
                return index === -1;
            }
            return true;
        });
    },

    // -----------------------------
    valueChange: function valueChange(settingId, value, ev) {
        var _props15 = this.props,
            dispatch = _props15.dispatch,
            core = _props15.core,
            designer = _props15.designer;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        // Update the value of one individual setting.


        var settings = [].concat(_toConsumableArray(model.Settings || []));
        settings.filter(function (s) {
            return s.Id === settingId;
        })[0].Value = value;

        model.Settings = settings;

        dispatch(coreActions.updateDefinition(model));
    },

    // -----------------------------
    updateOrder: function updateOrder(initialIndex, newIndex, handler) {
        var _props16 = this.props,
            dispatch = _props16.dispatch,
            designer = _props16.designer,
            core = _props16.core;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        // Use the handler given by the sortable to update the base array.


        var settings = handler(this.nestRules(), initialIndex, newIndex);
        var flatSettings = [];

        // Un-nest the settings in an order such that the nested rules have
        // have a Priority set just after its parent.
        settings.forEach(function (s) {
            return flatSettings = [].concat(_toConsumableArray(flatSettings), [s], _toConsumableArray(s.Rules));
        });

        // Set Priority based on index.
        flatSettings.forEach(function (s, i) {
            return s.Priority = i;
        });

        model.Settings = Forge.utilities.sortSettings(flatSettings);

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
var Definition__Settings = connect(function (state) {
    return _extends({}, state);
})(__Definition__Settings);
// =====================================
// Presentation
// =====================================
var __Definition__Tags = React.createClass({
    displayName: '__Definition__Tags',

    // -----------------------------
    render: function render() {

        var tagNodes = this.renderTags();
        var addTagNode = this.renderAddTag();

        return React.createElement(
            'div',
            { className: 'definition__tags field' },
            React.createElement(
                'label',
                { className: 'field__label' },
                addTagNode
            ),
            React.createElement(
                'div',
                { className: 'field__value' },
                ' ',
                tagNodes
            )
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        return {};
    },

    // -----------------------------
    renderAddTag: function renderAddTag() {
        var _props17 = this.props,
            core = _props17.core,
            designer = _props17.designer;

        var selectedItem = core.Definitions[designer.index];

        var activeIds = (selectedItem.Tags || []).map(function (t) {
            return t.Id;
        });
        var tagOptions = core.Tags.filter(function (tag) {
            return activeIds.indexOf(tag.Id) === -1;
        }).map(function (tag) {
            return React.createElement(
                'option',
                { key: tag.Id, value: tag.Id },
                tag.Name
            );
        });

        return React.createElement(
            'select',
            { className: 'button button--tertiary', onChange: this.changeNewTag, value: 'default', id: 'add-tag' },
            React.createElement(
                'option',
                { disabled: true, value: 'default' },
                'Add'
            ),
            tagOptions
        );
    },

    // -----------------------------
    renderTags: function renderTags() {
        var _this15 = this;

        var _props18 = this.props,
            core = _props18.core,
            designer = _props18.designer,
            dispatch = _props18.dispatch;

        var selectedItem = core.Definitions[designer.index];

        // Map tags into spans that can be removed onClick
        return (selectedItem.Tags || []).map(function (tag, index) {
            var removeTagHandler = _this15.removeTag.bind(_this15, index);

            var clickHandler = function clickHandler() {
                var newId = tag.Id !== designer.activeTagId ? tag.Id : null;
                dispatch(designerActions.activateTag(newId));
            };

            var className = 'definition__tag';
            if (tag.Id === designer.activeTagId) className += ' definition__tag--active';

            return React.createElement(
                'span',
                { className: className, onClick: clickHandler, key: tag.Id },
                React.createElement(
                    'span',
                    { className: 'definition__tag-name' },
                    tag.Name
                ),
                React.createElement('span', { className: 'fa fa-remove', onClick: removeTagHandler })
            );
        });
    },

    // -----------------------------
    changeNewTag: function changeNewTag(event) {
        var newTagId = +event.target.value;
        this.addTag(newTagId);
    },

    // -----------------------------
    removeTag: function removeTag(index) {
        var _props19 = this.props,
            core = _props19.core,
            designer = _props19.designer;

        var selectedItem = core.Definitions[designer.index];
        var newTags = [].concat(_toConsumableArray(selectedItem.Tags || []));

        // Remove the given tag from this array
        newTags.splice(index, 1);

        // Report the change
        this.reportChange(newTags);
    },

    // -----------------------------
    addTag: function addTag(tagId) {
        var _props20 = this.props,
            core = _props20.core,
            designer = _props20.designer;

        var selectedItem = core.Definitions[designer.index];
        var newTags = [].concat(_toConsumableArray(selectedItem.Tags || []));

        // Check first if this tag is already present in the array
        var tagExists = !!newTags.filter(function (t) {
            return tagId == t.Id;
        }).length;

        if (!tagExists) {

            // Get the full tag object from the store
            var tag = core.Tags.filter(function (t) {
                return t.Id == tagId;
            })[0];

            // Add the tag to this array
            newTags.push(tag);

            // Report the change
            this.reportChange(newTags);
        }
    },

    // -----------------------------
    reportChange: function reportChange(tags) {
        this.updateModel(tags);
    },

    // -----------------------------
    updateModel: function updateModel(tags) {
        var _props21 = this.props,
            designer = _props21.designer,
            dispatch = _props21.dispatch,
            core = _props21.core;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        model.Tags = tags;

        // Update rules
        model.Settings = Forge.utilities.sortSettings([].concat(_toConsumableArray((model.Settings || []).filter(function (s) {
            return !s.TagId;
        })), _toConsumableArray(Forge.utilities.getRules(tags, core.Rules))));

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
var Definition__Tags = connect(function (state) {
    return _extends({}, state);
})(__Definition__Tags);
// -------------------------------------------------
// <Designer.EditRule />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__EditRule = React.createClass({
    displayName: '__EditRule',


    // -----------------------------
    render: function render() {
        var _this16 = this;

        var _props22 = this.props,
            designer = _props22.designer,
            core = _props22.core;

        var selectedItem = core.Rules[designer.index];

        var update = function update(prop) {
            return _this16.updateModel.bind(_this16, prop);
        };

        return React.createElement(
            'div',
            { className: 'edit edit--rule field-group' },
            React.createElement(Field, { label: 'Tag',
                id: 'tag',
                defaultValue: selectedItem.TagId,
                onChange: update('TagId'),
                options: core.Tags }),
            React.createElement(Field, { label: 'Setting',
                id: 'setting',
                defaultValue: selectedItem.SettingId,
                onChange: update('SettingId'),
                options: core.Settings }),
            React.createElement(Field, { label: 'Value',
                id: 'value',
                defaultValue: selectedItem.Value,
                onChange: update('Value') })
        );
    },

    // -----------------------------
    updateModel: function updateModel(prop, ev) {
        var _props23 = this.props,
            designer = _props23.designer,
            core = _props23.core,
            dispatch = _props23.dispatch;

        var model = _objectWithoutProperties(core.Rules[designer.index], []);

        model[prop] = ev.target.value;

        if (prop === 'TagId' || prop === 'SettingId') {
            // Generate the name again based on tag/setting
            var tag = core.Tags.filter(function (t) {
                return t.Id == model.TagId;
            })[0];
            var setting = core.Settings.filter(function (t) {
                return t.Id == model.SettingId;
            })[0];

            model.Name = tag.Name + ' ' + setting.Name;
        }

        dispatch(coreActions.updateRule(model));
    }

});

// =====================================
// Container
// =====================================
Designer.EditRule = connect(function (state) {
    return _extends({}, state);
})(Designer.__EditRule);

// -------------------------------------------------
// <Designer.EditTag />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__EditTag = React.createClass({
    displayName: '__EditTag',


    // -----------------------------
    render: function render() {
        var _props24 = this.props,
            core = _props24.core,
            designer = _props24.designer;

        var selectedItem = core.Tags[designer.index];

        var ruleNodes = core.Rules.filter(function (rule) {
            return rule.TagId && rule.TagId === selectedItem.Id;
        }).map(this.renderLink);

        var definitionNodes = core.Definitions.filter(function (def) {
            var defTags = def.Tags.map(function (t) {
                return t.Id;
            });
            return def.Id && defTags.indexOf(selectedItem.Id) !== -1;
        }).map(this.renderLink);

        return React.createElement(
            'div',
            { className: 'edit edit--tag' },
            React.createElement(Field, { label: 'Name', id: 'tag-name', type: 'text', defaultValue: selectedItem.Name, onChange: this.updateTagName }),
            React.createElement('div', { className: 'separator' }),
            React.createElement(
                'div',
                { className: 'edit__information' },
                React.createElement(
                    Banner,
                    { header: 'Active Links', icon: 'linked' },
                    'View objects which currently have this tag applied to them.'
                ),
                React.createElement(
                    Field,
                    { label: 'Rules' },
                    React.createElement(
                        'ul',
                        { className: 'list list--static' },
                        ruleNodes
                    )
                ),
                React.createElement('div', { className: 'separator small' }),
                React.createElement(
                    Field,
                    { label: 'Definitions' },
                    React.createElement(
                        'ul',
                        { className: 'list list--static' },
                        definitionNodes
                    )
                )
            )
        );
    },

    // -----------------------------
    renderLink: function renderLink(item, tab) {

        return React.createElement(
            'li',
            { key: item.Name, className: 'list__item' },
            React.createElement(
                'a',
                null,
                item.Name
            )
        );
    },

    // -----------------------------
    updateTagName: function updateTagName(ev) {
        var _props25 = this.props,
            designer = _props25.designer,
            core = _props25.core,
            dispatch = _props25.dispatch;

        var tag = _objectWithoutProperties(core.Tags[designer.index], []);

        tag.Name = ev.target.value;

        dispatch(coreActions.updateTag(tag));
    }
});

// =====================================
// Container
// =====================================
Designer.EditTag = connect(function (state) {
    return _extends({}, state);
})(Designer.__EditTag);

var rootReducer = combineReducers({
    core: coreReducer,
    common: commonReducer,
    library: libraryReducer,
    designer: designerReducer,
    builder: builderReducer
});

var store = createStore(rootReducer, applyMiddleware(ReduxDebounce, ReduxThunk.default));