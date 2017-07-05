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
var GET_LOCAL_GAME = 'GET_LOCAL_GAME';

var CREATE_ITEM = 'CREATE_ITEM';
var UPDATE_ITEM = 'UPDATE_ITEM';
var DELETE_ITEM = 'DELETE_ITEM';
var ADD_SETTING = 'ADD_SETTING';
var UPDATE_GAME = 'UPDATE_GAME';
var UPDATE_ID = 'UPDATE_ID';
var UPDATE_GROUPS = 'UPDATE_GROUPS';

var BEGIN_SAVE_CORE = 'BEGIN_SAVE_CORE';
var END_SAVE_CORE = 'END_SAVE_CORE';

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
        FETCH_CORE: '/Core/Get',
        SAVE_CORE: '/Core/Save',
        SAVE_RULE: '/Core/SaveRule',
        SAVE_TAG: '/Core/SaveTag',
        SAVE_DEFINITION: '/Core/SaveDefinition',
        SAVE_GROUPS: '/Core/SaveGroups'
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
    getLocalGame: function getLocalGame(id) {
        return { type: GET_LOCAL_GAME, id: id };
    },
    fetchGame: function fetchGame(id) {
        var _this = this;

        return function (dispatch) {
            // Show loading indication.
            dispatch(_this.requestGame());

            // Fetch games from database with state filters.
            $.get(_this.api.FETCH_CORE, { id: id }).fail(function (response) {
                return dispatch(_this.getLocalGame(id));
            }).done(function (response) {
                var result = JSON.parse(response);
                dispatch(_this.receiveGame(result));
            });
        };
    },

    // --------------------------------
    updateItemId: function updateItemId(oldId, newId, tab) {
        return { type: UPDATE_ID, oldId: oldId, newId: newId, tab: tab };
    },

    // --------------------------------
    createItem: function createItem(tab) {
        var _this2 = this;

        var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return function (dispatch, getState) {

            // Get the current state data.
            var _getState = getState(),
                core = _getState.core,
                designer = _getState.designer;

            var gameId = core.Game.Id;
            var category = tab || designer.tab;

            var tempId = 'tempId-' + Math.random();
            model.GameId = gameId;

            var api = void 0;
            switch (category) {
                case CATEGORIES.TAGS:
                    api = _this2.api.SAVE_TAG;break;
                case CATEGORIES.RULES:
                    api = _this2.api.SAVE_RULE;break;
                case CATEGORIES.DEFINITIONS:
                    api = _this2.api.SAVE_DEFINITION;break;
            }

            // Create item locally before DB insert.
            dispatch({
                type: CREATE_ITEM,
                id: tempId,
                index: core[category].length,
                category: category
            });

            // Send model data to database.
            $.post(api, { model: model, gameId: gameId })
            //.fail(response => dispatch(coreActions.updateItem(model, tab, true)))
            .success(function (response) {
                return JSON.parse(response);
            }).then(function (id) {
                return dispatch(coreActions.updateItemId(tempId, id, category));
            });
        };
    },

    updateGroups: function updateGroups(groups) {
        var _this3 = this;

        return function (dispatch, getState) {
            var _getState2 = getState(),
                core = _getState2.core,
                designer = _getState2.designer;

            var gameId = core.Game.Id;

            $.post(_this3.api.SAVE_GROUPS, { groups: groups, gameId: gameId }).success(function (result) {
                return dispatch({ type: UPDATE_GROUPS, result: result });
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
    updateDefinition: function updateDefinition(model, fromCore) {
        return this.updateItem(model, CATEGORIES.DEFINITIONS, false, fromCore);
    },

    // --------------------------------
    updateItem: function updateItem(model, category, saved, fromCore) {
        // 'fromCore' is true only from the Forge.Definition component itself,
        // meaning that this update came from user input on the Builder,
        // not from editing the Designer.
        saved = fromCore ? !model.unsaved : saved;

        return function (dispatch, getState) {
            var _getState3 = getState(),
                designer = _getState3.designer,
                core = _getState3.core;

            var index = designer.index === -1 ? model.index : designer.index;

            dispatch({ type: UPDATE_ITEM, category: category, index: index, model: model, saved: saved, fromCore: fromCore });
        };
    },

    // --------------------------------
    updateGame: function updateGame(model) {
        return { type: UPDATE_GAME, model: model };
    },

    // --------------------------------
    save: function save() {
        var _this4 = this;

        return function (dispatch, getState) {

            dispatch({ type: BEGIN_SAVE_CORE });

            var _getState4 = getState(),
                core = _getState4.core;

            // Fetch games from database with state filters.


            $.post(_this4.api.SAVE_CORE, core)
            //.fail(response => dispatch(this.getLocalGame(id)))
            .done(function (r) {
                return dispatch({ type: END_SAVE_CORE });
            });
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
    unsaved: {},
    conflict: false,

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
    var _Forge$utilities = Forge.utilities,
        getRules = _Forge$utilities.getRules,
        sortSettings = _Forge$utilities.sortSettings;


    var nextState = _extends({}, state);

    switch (action.type) {
        // --------------------------------
        case REQUEST_GAME:
            var localGame = getGameFomLocalStorage(action.id) || initialCoreState;
            nextState = _extends({}, localGame, { loading: true });

            break;

        // --------------------------------
        case GET_LOCAL_GAME:
            // Check for a game that was saved to local and compare
            // it to what was retrieved from the database.
            var localGame = getGameFomLocalStorage(action.id);
            if (action.game) {
                var localTime = localGame.Game.ModifiedDate;
                var serverTime = action.game.ModifiedDate;
                if (localTime != serverTime) {
                    // The game saved in localStorage was updated at a different time
                    // than what was found in the database. Ask the user to decide which
                    // copy to keep.
                    nextState.conflict = {
                        localTime: localTime,
                        serverTime: serverTime
                    };

                    return nextState;
                }
            }

        // NO BREAK, FALL-THROUGH...
        // Same prep code for Local & DB.

        // --------------------------------
        case RECEIVE_GAME:
            nextState = _extends({}, nextState, action.game || localGame, {
                loading: false,
                saving: false
            });

            nextState.Groups = sortBy(nextState.Groups, 'Order');
            nextState.Rules.forEach(function (r, i) {
                return r.index = i;
            });
            nextState.Tags.forEach(function (t, i) {
                return t.index = i;
            });

            nextState.Definitions = nextState.Definitions.map(function (d, i) {
                // Get Rules & merge with Settings.
                var Rules = getRules(nextState, d);
                var MergedSettings = sortSettings([].concat(_toConsumableArray(Rules), _toConsumableArray(d.Settings))).filter(function (s) {
                    return !s.overridden;
                });
                return _extends({}, d, { index: i, Rules: Rules, MergedSettings: MergedSettings });
            });

            setGameToLocalStorage(nextState);
            break;

        // --------------------------------
        case CREATE_ITEM:
            // New item with temporary Id
            var newItem = {
                Id: action.id,
                Name: 'New ' + action.category.slice(0, -1)
            };

            switch (action.category) {
                case CATEGORIES.DEFINITIONS:
                    newItem = _extends({}, newItem, {
                        Category: action.category,
                        Settings: [],
                        Tags: [],
                        Rules: [],
                        MergedSettings: [],
                        unsaved: true
                    });
                    break;
            }

            nextState[action.category] = [].concat(_toConsumableArray(nextState[action.category]), [newItem]);

            nextState[action.category].forEach(function (x, i) {
                return x.index = i;
            });
            setGameToLocalStorage(nextState);

            break;

        // --------------------------------
        case UPDATE_ID:
            var index,
                items = [].concat(_toConsumableArray(state[action.tab]));
            items.forEach(function (x, i) {
                return index = x.Id === action.oldId ? i : index;
            });
            items[index].Id = action.newId;

            nextState[action.tab] = items;
            break;

        // --------------------------------
        case UPDATE_ITEM:
            var items = [].concat(_toConsumableArray(state[action.category]));
            items[action.index] = _extends({}, items[action.index], action.model, {
                unsaved: !action.saved
            });

            nextState[action.category] = items;

            // Update the count of total unsaved items.
            var unsavedKey = action.category + '-' + action.model.Id;
            if (!action.saved) nextState.unsaved[unsavedKey] = true;else delete nextState.unsaved[unsavedKey];

            var calculateAll = false;
            switch (action.category) {
                case CATEGORIES.TAGS:
                case CATEGORIES.RULES:
                    calculateAll = true;

                // NO BREAK
                case CATEGORIES.DEFINITIONS:
                    if (!action.fromCore) {
                        nextState.Definitions.forEach(function (d) {
                            if (calculateAll || d.Id == action.model.Id) {
                                d.Rules = getRules(nextState, d);
                                d.MergedSettings = sortSettings([].concat(_toConsumableArray(d.Rules), _toConsumableArray(d.Settings))).filter(function (s) {
                                    return !s.overridden;
                                });
                            }
                        });
                    }
                    break;
            }

            setGameToLocalStorage(nextState);
            break;

        // -------------------------------- 
        case UPDATE_GROUPS:
            nextState.Groups = sortBy(action.result, 'Order');
            break;

        // --------------------------------
        case DELETE_ITEM:
            nextState[action.tab] = state[action.tab].slice();
            nextState[action.tab].splice(action.model.index, 1);
            nextState[action.tab].forEach(function (x, i) {
                return x.index = i;
            });
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
                return s.SettingId === action.setting.Id;
            })[0];

            if (!settingExists) {
                definition.Settings = [].concat(_toConsumableArray(definition.Settings || []), [_extends({}, definitionSetting, {
                    Id: null,
                    DefinitionId: definition.Id,
                    SettingId: definitionSetting.Id,
                    Priority: 0
                })]);
            }

            definition.unsaved = true;

            // Upate the state array with the updated object.
            definitions[action.index] = definition;
            nextState.Definitions = definitions;
            setGameToLocalStorage(nextState);
            break;

        // --------------------------------
        case UPDATE_GAME:
            nextState.Game = _extends({}, state.Game, action.model);

            break;
    }

    return nextState;
}

// --------------------------------
function setGameToLocalStorage(state) {
    var Id = state.Game.Id;

    if (Id) {
        try {
            var gameJSON = JSON.stringify(state);
            localStorage.setItem('core_' + Id, gameJSON);
        } catch (err) {
            console.warn('Error saving game to local storage.', err);
        }
    }
}

// --------------------------------
function getGameFomLocalStorage(id) {
    if (id) {
        try {
            var gameJSON = localStorage.getItem('core_' + id);
            if (gameJSON) return JSON.parse(gameJSON);
        } catch (err) {
            console.warn('Error retrieving game from local storage.', err);
        }
    }
}
// Definition Settings
// =====================================
Forge.settings = {
    apply: function apply(value, setting) {
        var SettingName = setting.SettingName,
            Name = setting.Name;

        return this[SettingName || Name](value, setting);
    },

    // --------------------------------
    Minimum: function Minimum(value, setting) {
        if (isNaN(value)) value = 0;
        return Math.max(+value, +setting.Value);
    },

    // --------------------------------
    Maximum: function Maximum(value, setting) {
        if (isNaN(value)) value = 0;
        return Math.min(+value, +setting.Value);
    },

    // --------------------------------
    Default: function Default(value, setting) {
        return value || setting.Value;
    },

    // --------------------------------
    ValueIf: function ValueIf(value, setting) {
        var Definitions = store.getState().core.Definitions;

        var target = Definitions.filter(function (d) {
            return d.Id === setting.RelatedId;
        })[0];
        return target && target.Value === setting.RelatedValue ? setting.Value : value;
    }
};
// Core Functions
// =====================================
Forge.utilities = {
    renderControl: function renderControl(item, onChange) {
        // Dynamically create the component based on Control name.
        return React.createElement(Forge.components.controls[item.Control || item.ControlName || 'Text'], { Model: item, onChange: onChange });
    },

    // -----------------------------
    getRules: function getRules(state, definition) {
        var Rules = state.Rules,
            Tags = state.Tags;


        definition.Rules = definition.Rules || [];
        definition.Tags = definition.Tags || [];

        // Get all Rules associated to the Definition by Tags.
        var definitionTags = definition.Tags.map(function (t) {
            return +t.Id;
        });

        // Remove rules no longer associated by a Tag.
        // This will happen when a Tag has been removed from the Definition.
        var definitionRules = definition.Rules.filter(function (r) {
            return definitionTags.indexOf(+r.TagId) > -1;
        });

        // Add/Update all Rules from core.
        Rules.filter(function (r) {
            return definitionTags.indexOf(+r.TagId) > -1;
        }).forEach(function (r) {
            var match = definitionRules.filter(function (dr) {
                return dr.TagId == r.TagId && dr.SettingId == r.SettingId;
            })[0];
            if (!match) {
                // Add this rule.
                definitionRules.push(_extends({}, r, { Priority: definitionRules.length - 1 }));
            } else {
                // Update the rule.
                var index = definitionRules.indexOf(match);
                definitionRules[index] = _extends({}, match, r, {
                    // Maintain the Priority!!
                    Priority: match.Priority
                });
            }
        });

        return definitionRules.map(function (rule) {
            // Check if there's a local setting that overrides this rule,
            // Or a Rule with a higher Priority...
            var overridden = !!(definition.Settings.filter(function (s) {
                return s.Id == rule.SettingId;
            })[0] || definitionRules.filter(function (s) {
                return s.SettingId == rule.SettingId && s.Priority < rule.Priority;
            })[0]);

            // Return as a new DefinitionSettingModel
            return _extends({}, rule, {
                Id: rule.SettingId + '-' + rule.TagId,
                overridden: overridden
            });
        }).filter(function (r) {
            return !!r.TagId;
        });
    },

    // -----------------------------
    sortSettings: function sortSettings(settings) {
        return (settings || []).sort(function (a, b) {
            if (a.Priority > b.Priority) return 1;
            if (a.Priority < b.Priority) return -1;

            return 0;
        });
    },

    // -----------------------------
    getDefinitionSettings: function getDefinitionSettings(state, definition) {
        var rules = Forge.utilities.getRules(state, definition);
        return Forge.utilities.sortSettings([].concat(_toConsumableArray(definition.Settings), _toConsumableArray(rules)));
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
// Action Types
// =====================================
var OPEN_DIALOG = 'OPEN_DIALOG';
var CLOSE_DIALOG = 'CLOSE_DIALOG';

// Action Creators
// =====================================
var commonActions = {
    // --------------------------------
    openDialog: function openDialog(dialogType) {
        return { type: OPEN_DIALOG, dialogType: dialogType };
    },

    // --------------------------------
    closeDialog: function closeDialog() {
        return { type: CLOSE_DIALOG };
    }
};
var initialCommonState = {
    dialogType: null,

    genres: [{ id: 1, value: 'Fantasy' }, { id: 2, value: 'Sci-Fi' }]
};

function commonReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialCommonState;
    var action = arguments[1];

    var nextState = Object.assign({}, state);

    switch (action.type) {
        case GET_LOCAL_GAME:
            nextState.dialogType = designerActions.dialogTypes.LOAD_ERROR;
            break;

        // --------------------------------
        case OPEN_DIALOG:
            nextState.dialogType = action.dialogType;
            break;

        // --------------------------------
        case CLOSE_DIALOG:
            nextState.dialogType = null;
            break;
    }

    return nextState;
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
        var _this5 = this;

        var thunk = function thunk(dispatch, getState) {
            // Show loading indication.
            dispatch(_this5.requestGames());

            // Get the current filters from store state.
            var filters = getState().library.filters;

            // Fetch games from database with state filters.
            $.post(_this5.api.FETCH_GAMES, filters).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this5.receiveGames(result));
            });
        };

        return debounceAction(thunk, 'fetchGames', 500);
    },

    // --------------------------------
    createGame: function createGame(name) {
        var _this6 = this;

        return function (dispatch) {
            // Show loading indication.
            dispatch(_this6.requestGames());

            // Create game and retrieve a new list of games
            // (including the newly created one)
            $.post(_this6.api.CREATE_GAME, { name: name }).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this6.receiveGames(result));
            });
        };
    },

    // --------------------------------
    deleteGame: function deleteGame(id) {
        var _this7 = this;

        return function (dispatch) {
            $.post(api.DELETE_GAME, id).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this7.receiveGames(result));
            });
        };
    },

    // --------------------------------
    filterGames: function filterGames(key, value) {
        var _this8 = this;

        return function (dispatch) {
            // Update store filters.
            dispatch({ type: FILTER_GAMES, key: key, value: value });

            // Fetch games with new filters.
            dispatch(_this8.fetchGames());
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
            nextState.loading = true;
            break;

        // --------------------------------
        case RECEIVE_GAMES:
            nextState.games = action.games;
            nextState.loading = false;
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
var FORCE_LIST = 'FORCE_LIST';
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
        SAVE_DEFINITION: '/Core/SaveDefinition',
        DELETE_TAG: '/Core/DeleteTag',
        DELETE_RULE: '/Core/DeleteRule',
        DELETE_DEFINITION: '/Core/DeleteDefinition'
    },

    // --------------------------------
    dialogTypes: {
        LOAD_ERROR: 'LOAD_ERROR',
        LOAD_CONFLICT: 'LOAD_CONFLICT',
        EDIT_GROUPS: 'EDIT_GROUPS'
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
        var _this9 = this;

        return function (dispatch) {
            // Show loading indication.
            dispatch(_this9.requestDesigner());

            // Fetch games from database with state filters.
            $.get(_this9.api.FETCH_DESIGNER, { id: id }).then(function (response) {
                return JSON.parse(response);
            }).then(function (result) {
                return dispatch(_this9.receiveDesigner(result));
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
    navigate: function navigate(model) {
        return { type: SELECT_LIST_ITEM, category: model.Category, index: model.index };
    },

    // --------------------------------
    closeList: function closeList() {
        return { type: FORCE_LIST, listOpen: false, force: true };
    },

    // --------------------------------
    openList: function openList(listTab) {
        return { type: FORCE_LIST, listOpen: true, listTab: listTab, force: true };
    },

    // --------------------------------
    activateTag: function activateTag(tagId) {
        return { type: ACTIVATE_TAG, tagId: tagId };
    },

    // --------------------------------
    delete: function _delete() {
        var _this10 = this;

        return function (dispatch, getState) {

            // Get the current state data.
            var _getState5 = getState(),
                core = _getState5.core,
                designer = _getState5.designer;

            var tab = designer.tab,
                index = designer.index;

            var gameId = core.Game.Id;
            var model = _extends({}, core[tab][index]);

            dispatch({ type: DELETE_ITEM, model: model, tab: tab });

            var api = void 0;
            switch (designer.tab) {
                case CATEGORIES.TAGS:
                    api = _this10.api.DELETE_TAG;break;
                case CATEGORIES.RULES:
                    api = _this10.api.DELETE_RULE;break;
                case CATEGORIES.DEFINITIONS:
                    api = _this10.api.DELETE_DEFINITION;break;
            }

            $.post(api, { Id: model.Id });
        };
    },

    // --------------------------------
    saveModel: function saveModel() {
        var _this11 = this;

        var thunk = function thunk(dispatch, getState) {

            dispatch({ type: SAVE_MODEL });

            // Get the current state data.

            var _getState6 = getState(),
                core = _getState6.core,
                designer = _getState6.designer;

            var tab = designer.tab,
                index = designer.index;

            var gameId = core.Game.Id;
            var model = _extends({}, core[tab][index], {
                gameId: gameId
            });

            var api = void 0;
            switch (designer.tab) {
                case CATEGORIES.TAGS:
                    api = _this11.api.SAVE_TAG;break;
                case CATEGORIES.RULES:
                    api = _this11.api.SAVE_RULE;break;
                case CATEGORIES.DEFINITIONS:
                    api = _this11.api.SAVE_DEFINITION;break;
            }

            // Send model data to database.
            $.post(api, { model: model }).fail(function (response) {
                return dispatch(coreActions.updateItem(model, tab, true));
            }).success(function (response) {
                return JSON.parse(response);
            }).then(function (id) {
                // Check if an id was sent back from the controller -
                // this indicates if an item was inserted or updated.
                if (id) {
                    // A new item was created, so we need
                    // to capture the new Id and update the model.
                    model.Id = id;
                }

                dispatch(coreActions.updateItem(model, tab, true));
            });
        };

        return debounceAction(thunk, 'saveModel', 500);
    }
};
// Default navigation information based on 
// potential hash values to allow linking/refreshing.
var hash = (location.hash || '').split('/');
var initialDesignerState = {
    loading: true,
    saving: false,
    tab: (hash[0] || 'Menu').replace('#', ''),
    index: hash[1] || -1,
    listTab: 'List',
    itemHistory: []
};

function designerReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialDesignerState;
    var action = arguments[1];


    var nextState = Object.assign({}, state);
    nextState.navigated = false;

    if (action.tab || action.index) {
        // Push a new history item for the user to navigate back to.
        nextState.itemHistory = [{
            tab: state.tab,
            index: state.index
        }].concat(_toConsumableArray(state.itemHistory));
    }

    switch (action.type) {
        case GET_LOCAL_GAME:
            nextState.local = true;
        case RECEIVE_GAME:
            nextState.saving = false;
            nextState.loading = false;

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
        case FORCE_LIST:
        case SELECT_LIST_ITEM:
        case CREATE_ITEM:

            var listOpen = action.listOpen !== undefined ? action.listOpen : true;

            var listTab = action.listTab !== undefined ? action.listTab : 'List';

            var index = action.index !== undefined ? action.index : state.index;

            nextState = _extends({}, nextState, {
                listOpen: listOpen,
                listTab: listTab,
                index: index,
                navigated: action.force || !!action.category,
                tab: action.category || state.tab,
                activeTagId: null,
                saving: false,
                loading: false
            });

            break;

        case DELETE_ITEM:
            nextState.index = -1;
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

    window.location.hash = nextState.tab + '/' + nextState.index;

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
var __Account = React.createClass({
    displayName: '__Account',

    // -----------------------------
    render: function render() {

        return React.createElement('div', { className: 'account' });
    },

    // -----------------------------
    componentWillMount: function componentWillMount() {
        // Model comes from C# -
        // Set data into store with dispatch.
        // const { dispatch, id } = this.props;
        // dispatch(coreActions.fetchGame(id));
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // const game = nextProps.Game;
        // if (game && game.Name) document.title = `${game.Name} - Forge | Builder`;
    }
});

// =====================================
// Container
// =====================================
var Account = connect(function (state) {
    return _extends({}, state.core);
})(__Account);

// =====================================
// Root
// =====================================
Account.Provider = function (props) {
    return React.createElement(
        Provider,
        { store: store },
        React.createElement(Account, props)
    );
};

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
Builder._Groups = function (props) {
    var core = props.core;

    var topGroups = core.Groups.filter(function (g) {
        return !g.ParentId;
    });
    var groupNodes = topGroups.map(function (g) {
        return React.createElement(Builder.Group, { key: g.Id, core: core, model: g });
    });

    return React.createElement(
        'div',
        { className: 'builder__groups' },
        groupNodes
    );
};

// =====================================
// Container
// =====================================
Builder.Groups = connect(function (state) {
    return _extends({}, state);
})(Builder._Groups);

// =====================================
// <Builder.Group />
// =====================================
Builder.Group = function (props) {
    var core = props.core,
        model = props.model;


    var childNodes = core.Groups.filter(function (g) {
        return g.ParentId == model.Id;
    }).map(function (g) {
        return React.createElement(Builder.Group, { key: g.Id, core: core, model: g });
    });

    var definitionNodes = core.Definitions.filter(function (d) {
        return d.GroupId == model.Id;
    }).map(function (d, i) {
        return React.createElement(Forge.Definition, { key: i, model: d });
    });

    return React.createElement(
        'div',
        { className: 'builder__group group panel' },
        React.createElement(
            'h4',
            null,
            model.Name
        ),
        React.createElement(
            'div',
            { className: 'group__definitions' },
            definitionNodes
        ),
        React.createElement(
            'div',
            { className: 'group__children' },
            childNodes
        )
    );
};
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
var Checkbox = function Checkbox(props) {
    var id = props.id,
        label = props.label,
        name = props.name,
        checked = props.checked,
        onChange = props.onChange;


    return React.createElement(
        'span',
        { className: 'checkbox' },
        React.createElement('input', _extends({ className: 'checkbox__input', type: 'checkbox' }, props)),
        React.createElement(
            'label',
            { className: 'checkbox__label', htmlFor: id },
            label
        )
    );
};

var Dialog = function Dialog(props) {
    var children = props.children,
        header = props.header,
        buttons = props.buttons,
        requiredAction = props.requiredAction,
        onClose = props.onClose;


    var close = onClose ? function () {
        return onClose();
    } : function () {
        return store.dispatch(commonActions.closeDialog());
    };

    var overlayClick = requiredAction ? null : close;

    return React.createElement(
        'div',
        { className: 'dialog' },
        React.createElement(
            'div',
            { className: 'dialog__container' },
            React.createElement('div', { className: 'dialog__overlay overlay', onClick: overlayClick }),
            React.createElement(
                'div',
                { className: 'dialog__window' },
                React.createElement(
                    'div',
                    { className: 'dialog__header' },
                    React.createElement(
                        'div',
                        null,
                        header
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'button',
                            { className: 'dialog__close button button--transparent', onClick: close, title: 'Close' },
                            React.createElement('span', { className: 'fa fa-remove' })
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'dialog__content' },
                    children
                ),
                React.createElement(
                    'div',
                    { className: 'dialog__buttons' },
                    buttons || React.createElement(
                        'button',
                        { onClick: close },
                        'Close'
                    )
                )
            )
        )
    );
};

var Expandable = React.createClass({
    displayName: 'Expandable',

    // -----------------------------
    render: function render() {
        var _this12 = this;

        var _props2 = this.props,
            children = _props2.children,
            header = _props2.header;
        var open = this.state.open;


        var toggleOpen = function toggleOpen() {
            return _this12.setState({ open: !open });
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
var Field = function Field(_ref2) {
    var props = _objectWithoutProperties(_ref2, []);

    var change = function change(ev) {
        return props.onChange(ev.target.value);
    };

    var controlNode = props.children || (props.options ? React.createElement(Select, _extends({}, props, { onChange: change })) : React.createElement('input', _extends({}, props, { onChange: change })));

    var tooltipNode = props.tooltip ? React.createElement(
        Tooltip,
        { tip: props.tooltip, icon: true },
        '?'
    ) : undefined;

    var afterNode = props.after ? React.createElement(
        'span',
        { className: 'field__after' },
        props.after
    ) : undefined;

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
            controlNode
        ),
        afterNode
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
            'TatianaVeratti@gmail.com @TatianaVeratti'
        );
    },

    // ----------------------------
    componentDidMount: function componentDidMount() {
        // this.contentNode = document.getElementById('content');
        // this.footerNode = this.refs.footer;

        // // Every (resizeTime) milliseconds, calculate the footer's height.
        // // This is to compensate for window and body size changes.
        // this.interval = window.setInterval(this.updateSize, 300);
        // this.updateSize();
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
var __GenreSelect = function __GenreSelect(_ref3) {
    var props = _objectWithoutProperties(_ref3, []);

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

        var toggleSiteClassName = 'toggle nav__menu t-'; // + siteUlClass;
        var toggleAccountClassName = 'toggle nav__user t-'; // + accountUlClass;

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
var Radio = function Radio(_ref4) {
    var id = _ref4.id,
        label = _ref4.label,
        name = _ref4.name;
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
var Select = function Select(_ref5) {
    var props = _objectWithoutProperties(_ref5, []);

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

    optionNodes.unshift(React.createElement(
        'option',
        { key: 'none', value: 0 },
        '-- Select --'
    ));

    var onChange = function onChange(ev) {
        return props.onChange && props.onChange(ev.target.value);
    };

    return React.createElement(
        'select',
        _extends({ className: 'select__input' }, props),
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


        var handleNode = void 0;
        var className = 'sortable__item';
        var itemProps = {
            key: 'item-' + (content.Id || content.Name),
            onDragOver: this.itemHover.bind(this, index)
        };

        var slotNode = initialIndex !== index ? this.renderSlot(index) : null;

        if (!content.DisableDrag) {
            if (initialIndex === index) className += ' sortable__item--dragging';

            handleNode = React.createElement('span', { className: 'sortable__handle',
                draggable: true,
                onDragStart: this.beginDrag.bind(this, index),
                onDragEnd: this.endDrag });
        } else className += ' sortable__item--disabled';

        return [slotNode, React.createElement(
            'li',
            _extends({}, itemProps, { className: className }),
            handleNode,
            React.createElement(
                'span',
                { className: 'sortable__content' },
                content
            )
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
        var _props4 = this.props,
            id = _props4.id,
            name = _props4.name,
            onChange = _props4.onChange,
            label = _props4.label,
            checked = _props4.checked;

        var className = 'tab';
        if (checked) className += ' tab--checked';

        return React.createElement(
            'span',
            { className: className },
            React.createElement('input', { className: 'tab__input', id: id, type: 'radio', name: name, onChange: onChange, ref: 'input' }),
            React.createElement(
                'label',
                { className: 'tab__label', htmlFor: id },
                label
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
// =====================================
// <Tooltip />
// =====================================
var Tooltip = function Tooltip(_ref6) {
    var children = _ref6.children,
        tip = _ref6.tip,
        onClick = _ref6.onClick,
        icon = _ref6.icon;

    var iconNode = icon ? React.createElement('span', { className: 'fa fa-info-circle', 'aria-hidden': 'true' }) : undefined;

    return React.createElement(
        'div',
        { className: 'tooltip', onClick: onClick },
        children,
        icon,
        React.createElement(
            'div',
            { className: 'tooltip__value' },
            tip
        )
    );
};
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
        var model = _objectWithoutProperties(this.props.model, []);

        model._formId = 'd-' + model.Id;

        // Dynamically create the component based on Control name.
        var controlNode = Forge.utilities.renderControl(model, this.valueChange);

        return React.createElement(
            'div',
            { className: 'definition' },
            React.createElement(
                'label',
                { htmlFor: model._formId, className: 'definition__name' },
                model.Name
            ),
            React.createElement(
                'div',
                { className: 'definition__control' },
                controlNode
            )
        );
    },

    // -----------------------------
    componentWillMount: function componentWillMount() {
        // Trigger Lifecycle: Initialize
        var _props5 = this.props,
            core = _props5.core,
            model = _props5.model;
        var stages = Forge.lifeCycle.stages;

        this.valueChange(model.Value, stages.init);
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // Trigger Lifecycle: Update
        var core = nextProps.core,
            model = nextProps.model;
        var stages = Forge.lifeCycle.stages;

        this.valueChange(model.Value, stages.update, nextProps);
    },

    // -----------------------------
    valueChange: function valueChange(value, stage, props) {
        var lifeCycle = Forge.lifeCycle,
            settings = Forge.settings;

        // Defaults (event triggered == null)

        stage = stage || lifeCycle.stages.update;
        props = props || this.props;

        var _props6 = props,
            model = _props6.model,
            core = _props6.core,
            dispatch = _props6.dispatch;

        // Apply all settings that match the current lifecycle
        // model.MergedSettings
        //     .filter(s => lifeCycle.isActive(s.LifeCycle, stage))
        //     .forEach(s => value = settings.apply(value, s));

        if (typeof value == 'number' && isNaN(value)) value = 0;

        if (value != props.model.Value) {
            dispatch(coreActions.updateDefinition(_extends({}, model, { Value: value }), true));
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
// |         a         |
// |         b         |
// =====================
// | 1 |     2         |
// |   |               |
// |   |               |
// =====================
// a: Designer.Summary
// b: Designer.Tabs
// 1: Designer.List
// 2: Designer.Stage
//
// --------------------------------------------------
// =====================================
// Presentation
// =====================================
var __Designer = React.createClass({
    displayName: '__Designer',

    // -----------------------------
    render: function render() {
        var _props7 = this.props,
            designer = _props7.designer,
            dispatch = _props7.dispatch;

        var loading = designer.saving || designer.loading;

        var className = 'designer';
        if (loading) className += ' designer--loading';

        var closeList = function closeList() {
            return dispatch(designerActions.closeList());
        };

        return React.createElement(
            'div',
            { className: className },
            React.createElement(Designer.Dialogs, null),
            React.createElement(
                'div',
                { className: 'section section--secondary' },
                loading && React.createElement('div', { className: 'loading-bar' }),
                React.createElement(Designer.Summary, null),
                React.createElement(Designer.Tabs, null)
            ),
            React.createElement(
                'div',
                { className: 'designer__views' },
                React.createElement(Designer.List, null),
                React.createElement(Designer.Stage, null),
                React.createElement('div', { className: 'designer__overlay overlay', onClick: closeList })
            )
        );
    },

    // -----------------------------
    componentWillMount: function componentWillMount() {
        // Model comes from C# -
        // Set data into store with dispatch.
        var _props8 = this.props,
            dispatch = _props8.dispatch,
            id = _props8.id;

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

// -------------------------------------------------
// <Designer.Summary />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Summary = React.createClass({
    displayName: '__Summary',

    render: function render() {
        var Game = this.props.core.Game;
        var loading = this.props.designer.loading;


        var createdAgo = moment.utc(Game.CreatedDate).fromNow();

        return React.createElement(
            'div',
            { className: 'section section--summary designer__summary' },
            React.createElement(
                'h1',
                null,
                Game.Name || loading && 'Loading...' || '\xA0'
            ),
            React.createElement(
                'p',
                null,
                React.createElement(
                    'b',
                    null,
                    Game.CreatedByUserName
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
    return _extends({}, state);
})(Designer.__Summary);

// -------------------------------------------------
// <Designer.Tabs />
// -------------------------------------------------
// =====================================
// Presentation
// =====================================
Designer.__Tabs = React.createClass({
    displayName: '__Tabs',

    views: ['Menu', 'Preview', 'Tags', 'Rules', 'Definitions'],

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
        var _this13 = this;

        // Active Tab Check
        var checked = label === this.props.tab || undefined;

        // Click Handler
        // Dispatch action to store and update filter for tab.
        var onClick = function onClick() {
            return _this13.props.dispatch(designerActions.changeTab(label));
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
var __Library = function __Library(props) {
    var loading = props.library.loading;


    return React.createElement(
        'div',
        { className: 'library' },
        React.createElement(
            'div',
            { className: 'section section--secondary' },
            loading && React.createElement('div', { className: 'loading-bar' }),
            React.createElement(Library.Summary, null),
            React.createElement(Library.Controls, null)
        ),
        React.createElement(Library.List, null)
    );
};

// =====================================
// Container
// =====================================
var Library = connect(function (state) {
    return _extends({}, state);
})(__Library);

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
            React.createElement(Library.Filters, null)
        );
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
        var _this14 = this;

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
            var tabHandler = _this14.changeFilter.bind(_this14, PERMISSION, permission.id);
            var checked = permission.id === _this14.props.library.filters[PERMISSION];
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

    var updated = moment(game.ModifiedDate).format('MMM DD');
    var created = moment(game.CreatedDate).format('MMM DD');

    return React.createElement(
        'li',
        { className: 'library__game game panel panel--clickable' },
        React.createElement(
            'a',
            { href: '/Designer?id=' + game.Id },
            React.createElement('div', { className: 'game__column game__column--icons' }),
            React.createElement(
                'div',
                { className: 'game__column game__column--summary' },
                React.createElement(
                    'p',
                    { className: 'game__name' },
                    game.Name
                ),
                React.createElement(
                    'p',
                    null,
                    game.CreatedByUserName
                )
            ),
            React.createElement(
                'div',
                { className: 'game__column game__column--dates' },
                React.createElement(
                    'p',
                    null,
                    created
                ),
                React.createElement(
                    'p',
                    null,
                    updated
                )
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
            'div',
            { className: 'library__list' },
            React.createElement(
                'div',
                { className: 'library__create' },
                React.createElement('input', { ref: 'input' }),
                React.createElement(
                    'button',
                    { onClick: this.createGame },
                    'Create'
                )
            ),
            React.createElement(
                'ul',
                null,
                gameNodes
            )
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
Library.List = connect(function (state) {
    return _extends({}, state.library);
})(Library.__List);

// =====================================
// <Library.Summary />
// =====================================
Library.Summary = function () {
    return React.createElement(
        'div',
        { className: 'section section--summary library__summary' },
        React.createElement(
            'h1',
            null,
            'Library'
        )
    );
};
Forge.components.controls.Dictionary = React.createClass({
    displayName: 'Dictionary',

    render: function render() {
        var _this15 = this;

        var Keys = this.props.Model.Keys;


        var keyNodes = (Keys || []).map(function (v) {
            return v.Key;
        }).join(', ');
        var listNodes = this.renderList(true);

        var dialogNode = this.state.dialog ? this.renderEditDialog() : undefined;

        var editHandler = function editHandler() {
            return _this15.setState({ dialog: true });
        };

        return React.createElement(
            'div',
            { className: 'dictionary' },
            React.createElement(
                Tooltip,
                { tip: listNodes, onClick: editHandler },
                React.createElement(
                    'div',
                    { className: 'input' },
                    keyNodes
                )
            ),
            dialogNode
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        return { dialog: false };
    },

    // -----------------------------
    renderEditDialog: function renderEditDialog() {
        var _this16 = this;

        var _props9 = this.props,
            Model = _props9.Model,
            allowAdd = _props9.allowAdd;


        var dialogProps = {
            header: 'Edit: ' + Model.Name,
            onClose: function onClose() {
                return _this16.setState({ dialog: false });
            }
        };

        var formNode = allowAdd ? this.renderAddForm() : undefined;

        var listNodes = this.renderList();

        return React.createElement(
            Dialog,
            dialogProps,
            formNode,
            listNodes
        );
    },

    // -----------------------------
    renderAddForm: function renderAddForm() {
        return React.createElement(
            'form',
            { className: 'dictionary__add', ref: 'form' },
            React.createElement('input', { type: 'text', ref: 'key', placeholder: 'Key' }),
            React.createElement('input', { type: 'text', ref: 'value', placeholder: 'Value' }),
            React.createElement(
                'button',
                { type: 'submit', className: 'button button--tertiary', onClick: this.add },
                'Add'
            )
        );
    },

    // -----------------------------
    renderList: function renderList(flat) {
        var _this17 = this;

        var Model = this.props.Model;


        var list = Model.Keys || [];
        var listNodes = list.map(function (x, i) {
            return _this17.renderPair(x, i, flat);
        });
        return listNodes.length ? React.createElement(
            'ul',
            { className: 'dictionary__list' },
            listNodes
        ) : 'No Values';
    },

    // -----------------------------
    renderPair: function renderPair(item, index, flat) {
        var allowAdd = this.props.allowAdd;
        var Key = item.Key,
            Value = item.Value,
            ControlName = item.ControlName;


        var id = 'k-' + Key;

        var valueNode = flat ? React.createElement(
            'span',
            { className: 'dictionary__value' },
            Value
        ) : this.renderControl(item, index);

        var removeNode = allowAdd && !flat ? React.createElement(
            'button',
            { className: 'button button--transparent', title: 'Remove' },
            React.createElement('span', { className: 'fa fa-remove' })
        ) : undefined;

        return React.createElement(
            'li',
            { key: id },
            React.createElement(
                'label',
                { htmlFor: id, className: 'dictionary__key' },
                Key
            ),
            valueNode,
            removeNode
        );
    },

    // -----------------------------
    renderControl: function renderControl(item, index) {
        var onChange = this.changePair.bind(this, index);

        // Dynamically create the component based on Control name.
        return React.createElement(Forge.components.controls[item.Control || item.ControlName || 'Text'], { Model: item, onChange: onChange });
    },

    // -----------------------------
    changePair: function changePair(index, value) {
        var Keys = this.props.Model.Keys;

        var list = Keys && [].concat(_toConsumableArray(Keys));

        list[index].Value = value;

        this.reportChange(list);
    },

    // -----------------------------
    add: function add() {
        var Keys = this.props.Model.Keys;

        var list = Keys && [].concat(_toConsumableArray(Keys));

        list.push({ Key: key.value, Value: value.value });
        this.reportChange(list);

        form.reset();
    },

    // -----------------------------
    reportChange: function reportChange(list) {
        var onChange = this.props.onChange;
        var value = ev.target.value;


        onChange && onChange(list);
    }
});
Forge.components.controls.Number = React.createClass({
    displayName: 'Number',

    // -----------------------------
    render: function render() {
        var Model = this.props.Model;


        var value = Model.Value;
        if (isNaN(value)) value = 0;

        return React.createElement('input', { id: Model._formId, type: 'number', value: value, onChange: this.change });
    },

    // -----------------------------
    change: function change(ev) {
        var onChange = this.props.onChange;
        var value = ev.target.value;


        onChange && onChange(+value);
    }
});
Forge.components.controls.Select_Definition = React.createClass({
    displayName: 'Select_Definition',

    // -----------------------------
    render: function render() {
        var _props10 = this.props,
            Model = _props10.Model,
            Value = _props10.Value;

        var _store$getState = store.getState(),
            core = _store$getState.core;

        var value = Model.Value || Value || '';

        return React.createElement(Select, { options: core.Definitions, value: value, onChange: this.change });
    },

    // -----------------------------
    change: function change(ev) {
        var onChange = this.props.onChange;
        var value = ev.target.value;


        onChange && onChange(+value);
    }
});

Forge.components.controls.Text = React.createClass({
    displayName: 'Text',

    // -----------------------------
    render: function render() {
        var Model = this.props.Model;


        var value = Model.Value || '';

        return React.createElement('input', { id: Model._formId, type: 'text', value: value, onChange: this.change });
    },

    // -----------------------------
    change: function change(ev) {
        var onChange = this.props.onChange;
        var value = ev.target.value;


        onChange && onChange(value);
    }
});
// =====================================
// Presentation
// =====================================
Designer.__Dialogs = function (props) {
    var dialogType = props.dialogType;
    var _designerActions$dial = designerActions.dialogTypes,
        LOAD_ERROR = _designerActions$dial.LOAD_ERROR,
        LOAD_CONFLICT = _designerActions$dial.LOAD_CONFLICT,
        EDIT_GROUPS = _designerActions$dial.EDIT_GROUPS;


    switch (dialogType) {
        case LOAD_ERROR:
            return React.createElement(Designer.LoadError, null);
        case EDIT_GROUPS:
            return React.createElement(Designer.Groups, null);
    }

    return React.createElement('span', null);

    // -----------------------------
    // getLoadConflictProps: function(){
    //     const { Game, conflict } = this.props.core;

    //     return {
    //         header: 'Conflicting Designer Data',
    //         children: (
    //             <div>
    //                 The Designer data retrieved from the database does not match your local version. Please choose which version of the Designer you wish to keep.
    //                 <p>Local: {Game.UpdatedDate}, {Game.UpdatedByUserName}</p>
    //                 <p>Last Saved: {conflict.UpdatedDate}, {conflict.UpdatedByUserName}</p>
    //             </div>
    //         ),
    //         buttons: [
    //             <button>Local</button>,
    //             <button>Last Saved</button>
    //         ]
    //     }
    // },
};

// =====================================
// Container
// =====================================
Designer.Dialogs = connect(function (state) {
    return { dialogType: state.common.dialogType };
})(Designer.__Dialogs);

// =====================================
// Presentation
// =====================================
Designer.__Groups = React.createClass({
    displayName: '__Groups',

    // -----------------------------
    render: function render() {
        var groupNodes = this.renderGroups();
        var buttons = [React.createElement(
            'button',
            { onClick: this.submitGroups },
            'Save'
        ), React.createElement(
            'button',
            { onClick: this.close },
            'Cancel'
        )];

        return React.createElement(
            Dialog,
            { header: 'Edit Groups', buttons: buttons },
            React.createElement(
                'div',
                { className: 'designer__add-group' },
                React.createElement('input', { type: 'text', ref: 'name', placeholder: 'Name' }),
                React.createElement(
                    'button',
                    { className: 'button button--tertiary', onClick: this.addGroup },
                    'Add'
                )
            ),
            React.createElement(Sortable, { list: groupNodes, onChange: this.updateOrder })
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        return { groups: this.props.Groups || [] };
    },

    // -----------------------------
    renderGroups: function renderGroups() {
        var _this18 = this;

        return this.state.groups.map(function (g, i) {

            var updateHandler = _this18.updateGroup.bind(_this18, i);
            var removeHandler = _this18.removeGroup.bind(_this18, i);

            return React.createElement(
                'div',
                { className: 'designer__group' },
                React.createElement('input', { value: g.Name, onChange: updateHandler }),
                React.createElement('span', { className: 'fa fa-remove', onClick: removeHandler })
            );
        });
    },

    // -----------------------------
    updateOrder: function updateOrder(initialIndex, newIndex, handler) {
        // Use the handler given by the sortable to update the base array.
        var groups = handler(this.state.groups, initialIndex, newIndex);
        groups.forEach(function (g, i) {
            return g.Order = i;
        });
        this.setState({ groups: groups });
    },

    // -----------------------------
    submitGroups: function submitGroups() {
        var dispatch = this.props.dispatch;

        dispatch(coreActions.updateGroups(this.state.groups));
        this.close();
    },

    // -----------------------------
    addGroup: function addGroup() {
        var name = this.refs.name;


        var model = { Name: name.value };

        this.setState({
            groups: [].concat(_toConsumableArray(this.state.groups), [model])
        });
    },

    // -----------------------------
    updateGroup: function updateGroup(index, ev) {
        var groups = [].concat(_toConsumableArray(this.state.groups));
        groups[index].Name = ev.target.value;
        this.setState({ groups: groups });
    },

    removeGroup: function removeGroup(index) {
        var groups = [].concat(_toConsumableArray(this.state.groups));
        groups.slice(index, 1);

        this.setState({ groups: groups });
    },

    close: function close() {
        var dispatch = this.props.dispatch;

        dispatch(commonActions.closeDialog());
    }
});

// =====================================
// Container
// =====================================
Designer.Groups = connect(function (state) {
    return { Groups: state.core.Groups };
})(Designer.__Groups);

Designer.LoadError = function () {
    return React.createElement(
        Dialog,
        { header: 'Connection Failed' },
        'The Designer could not be loaded. You may continue working in offline mode, but your changes will not be committed to the database until your connection resumes.'
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
            { className: className, ref: 'wrapper' },
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
        return { open: false, listTab: 'List' };
    },

    // -----------------------------
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var designer = nextProps.designer;


        if (designer.navigated) {
            this.setState({
                open: designer.listOpen,
                listTab: designer.listTab
            });
        } else if (designer.tab !== this.props.designer.tab) {
            this.setState({
                open: true,
                listTab: 'List'
            });
        }
    },

    // -----------------------------
    componentDidUpdate: function componentDidUpdate(prevProps) {
        if (this.props.designer.navigated) {
            $('#designer')[0].scrollIntoView(true);
        }
    },

    // -----------------------------
    renderList: function renderList() {
        var _this19 = this;

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
            if (item.unsaved) className += ' designer__list-item--unsaved';

            // Click Handler.
            var onClick = function onClick() {
                _this19.setState({ open: false });
                _this19.props.dispatch(designerActions.selectListItem(i));
            };

            return React.createElement(
                'li',
                { key: key, className: className },
                React.createElement(
                    'button',
                    { className: 'button button--transparent', onClick: onClick },
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
        var _this20 = this;

        var tab = this.props.designer.tab;
        var _state2 = this.state,
            open = _state2.open,
            listTab = _state2.listTab,
            navigated = _state2.navigated;


        var toggleText = open ? 'Hide' : 'Show';
        var toggle = function toggle() {
            return _this20.setState({ open: !open });
        };

        var buttons = ['List', 'Search'];
        if (tab === CATEGORIES.DEFINITIONS) buttons.push('Settings');

        var miniButtons = buttons.map(function (b) {
            var onClick = _this20.changeList.bind(_this20, b);
            var className = 'button icon icon--' + b.toLowerCase();
            if (b === listTab) {
                className += ' button--active';
                if (navigated) className += ' button--flash';
            }

            return React.createElement('button', { key: b, className: className, title: b, onClick: onClick });
        });
        //<button className='button button--transparent designer__toggle' onClick={toggle} title={toggleText} /> 
        return React.createElement(
            'div',
            { className: 'designer__list-actions' },
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
        if (!open) {
            open = true;
        }

        this.setState({ listTab: tab, open: open });
    },

    // -----------------------------
    new: function _new() {
        this.setState({ open: false });
        this.props.dispatch(coreActions.createItem());
    }
});

// =====================================
// Container
// =====================================
Designer.List = connect(function (state) {
    return _extends({}, state);
})(Designer.__List);
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
            return contains((x.Name || '').toLowerCase(), filterLower) || x.header;
        }) : [];

        listNodes = listNodes.filter(function (x, i) {
            return !x.header || x.header && !(listNodes[i + 1] || { header: true }).header;
        }).map(this.renderItem);

        return React.createElement(
            'div',
            { className: 'designer__search' },
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


        return [{ header: CATEGORIES.RULES }].concat(_toConsumableArray(sortBy(this.mapTabItems(core.Rules, CATEGORIES.RULES), 'Name')), [{ header: CATEGORIES.TAGS }], _toConsumableArray(sortBy(this.mapTabItems(core.Tags, CATEGORIES.TAGS), 'Name')), [{ header: CATEGORIES.DEFINITIONS }], _toConsumableArray(sortBy(this.mapTabItems(core.Definitions, CATEGORIES.DEFINITIONS), 'Name')));
    },

    // -----------------------------
    mapTabItems: function mapTabItems(items, tab) {
        return items.map(function (item, index) {
            return _extends({}, item, { index: index, tab: tab });
        });
    },

    // -----------------------------
    renderItem: function renderItem(item) {
        var _props11 = this.props,
            dispatch = _props11.dispatch,
            designer = _props11.designer;

        var key = item.tab + '-' + (item.Id || item.TempId || item.Name || item.header);

        if (item.header) {
            return React.createElement(
                'li',
                { key: key, className: 'designer__list-header' },
                item.header
            );
        }

        // ClassName modifiers.
        var className = 'designer__list-item';
        if (item.unsaved) className += ' designer__list-item--unsaved';
        if (item.tab === designer.tab && item.index === designer.index) className += ' designer__list-item--selected';

        // Click Handler.
        var onClick = function onClick() {
            return dispatch(designerActions.navigate(item));
        };

        return React.createElement(
            'li',
            { key: key, className: className },
            React.createElement(
                'button',
                { className: 'button button--transparent', onClick: onClick },
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
        var _this21 = this;

        var _props12 = this.props,
            settings = _props12.settings,
            core = _props12.core,
            designer = _props12.designer;

        var activeItem = core.Definitions[designer.index];
        if (!activeItem) return;

        var activeSettings = (activeItem.Settings || []).map(function (s) {
            return s.Name;
        });

        return settings.map(function (s) {

            var clickHandler = _this21.addSetting.bind(_this21, s);
            var className = 'designer__list-item setting ';
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
                    { className: 'button button--transparent', onClick: clickHandler, disabled: disabled },
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
        var _props13 = this.props,
            dispatch = _props13.dispatch,
            index = _props13.index;

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

// =====================================
// <Designer.Link />
// =====================================
Designer.Link = function (_ref8) {
    var model = _ref8.model,
        hideCategory = _ref8.hideCategory;

    var onClick = function onClick() {
        return store.dispatch(designerActions.navigate(model));
    };

    return React.createElement(
        'button',
        { className: 'button button--link designer__link', onClick: onClick },
        React.createElement(
            'span',
            null,
            model.Name
        ),
        !hideCategory && React.createElement(
            'span',
            null,
            model.Category
        )
    );
};
// =====================================
// Presentation
// =====================================
Designer._Menu = React.createClass({
    displayName: '_Menu',

    // -----------------------------
    render: function render() {
        var _props$core = this.props.core,
            Game = _props$core.Game,
            Tags = _props$core.Tags,
            Rules = _props$core.Rules,
            Definitions = _props$core.Definitions;


        var accessTypes = ['Public', 'Private', 'Friends'].map(function (t) {
            return { Id: t, Name: t };
        });

        var genres = ['Fantasy', 'Horror'].map(function (g) {
            return { Id: g, Name: g };
        });

        var categories = [CATEGORIES.TAGS, CATEGORIES.RULES, CATEGORIES.DEFINITIONS];
        var tileNodes = categories.map(this.renderTile);

        return React.createElement(
            'div',
            { className: 'designer__menu' },
            React.createElement(
                'div',
                { className: 'panel ' },
                React.createElement(
                    'h4',
                    null,
                    'Game Settings'
                ),
                React.createElement(
                    'div',
                    { className: 'field-group' },
                    React.createElement(
                        Field,
                        { label: 'Id' },
                        Game.Id
                    ),
                    React.createElement('div', { className: 'separator separator--small' }),
                    React.createElement(Field, { label: 'Name',
                        id: 'name',
                        value: Game.Name }),
                    React.createElement(Field, { label: 'Access',
                        id: 'access',
                        defaultValue: 1,
                        options: accessTypes }),
                    React.createElement(Field, { label: 'Genre',
                        id: 'genre',
                        defaultValue: 1,
                        options: genres })
                )
            ),
            React.createElement(Designer.Recent, null)
        );
    },

    // -----------------------------
    renderTile: function renderTile(category) {
        var _props14 = this.props,
            core = _props14.core,
            dispatch = _props14.dispatch;

        var count = core[category].length;
        var onClick = function onClick() {
            return dispatch(designerActions.changeTab(category));
        };

        return React.createElement(
            'button',
            { className: 'designer__tile', onClick: onClick },
            React.createElement(
                'p',
                { className: 'designer__tile-title' },
                count
            ),
            React.createElement(
                'p',
                null,
                category
            )
        );
    }
});

// =====================================
// Container
// =====================================
Designer.Menu = connect(function (state) {
    return _extends({}, state);
})(Designer._Menu);

// =====================================
// Presentation
// =====================================
Designer.__Preview = React.createClass({
    displayName: '__Preview',

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
})(Designer.__Preview);

// =====================================
// <Designer.Link />
// =====================================
Designer.__Recent = function (_ref9) {
    var core = _ref9.core,
        designer = _ref9.designer,
        dispatch = _ref9.dispatch;

    var categories = [CATEGORIES.TAGS, CATEGORIES.RULES, CATEGORIES.DEFINITIONS];
    var sourceItems = [].concat(_toConsumableArray(core.Tags), _toConsumableArray(core.Rules), _toConsumableArray(core.Definitions));

    var recentNodes = sourceItems.slice().sort(function (a, b) {
        return new Date(b.ModifiedDate) - new Date(a.ModifiedDate);
    }).reverse().slice(0, 5).map(function (x, i) {
        return React.createElement(
            'li',
            null,
            React.createElement(Designer.Link, { key: i, model: x })
        );
    });

    var startNodes = categories.map(function (c) {
        var createItem = function createItem() {
            return dispatch(coreActions.createItem(c));
        };
        var label = c.slice(0, -1);
        var disabled = core.Game.IsLocked;
        return React.createElement(
            'li',
            { key: c },
            React.createElement(
                'button',
                { className: 'button button--link', onClick: createItem, disabled: disabled },
                'New ',
                label
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'designer__recent recent panel' },
        React.createElement(
            'div',
            { className: 'recent__columns' },
            React.createElement(
                'ul',
                null,
                React.createElement(
                    'li',
                    { className: 'recent__header' },
                    'Create'
                ),
                startNodes
            ),
            React.createElement(
                'ul',
                null,
                React.createElement(
                    'li',
                    { className: 'recent__header' },
                    'Recent'
                ),
                recentNodes
            ),
            React.createElement(
                'ul',
                null,
                React.createElement(
                    'li',
                    { className: 'recent__header' },
                    'Help'
                ),
                React.createElement(
                    'li',
                    null,
                    React.createElement(
                        'button',
                        { className: 'button button--link' },
                        'Getting Started'
                    )
                ),
                React.createElement(
                    'li',
                    null,
                    React.createElement(
                        'button',
                        { className: 'button button--link' },
                        'Publish Your Game'
                    )
                ),
                React.createElement(
                    'li',
                    null,
                    React.createElement(
                        'button',
                        { className: 'button button--link' },
                        'FAQ'
                    )
                )
            )
        )
    );
};

// =====================================
// Container
// =====================================
Designer.Recent = connect(function (state) {
    return _extends({}, state);
})(Designer.__Recent);

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
        var unsaved = this.props.core.unsaved;
        var _props$designer2 = this.props.designer,
            tab = _props$designer2.tab,
            index = _props$designer2.index,
            itemHistory = _props$designer2.itemHistory;

        var item = this.getSelectedItem();

        var uniqueId = item ? item.Id || item.TempId || item.Name : '';

        var className = 'designer__stage stage stage--' + tab.toLowerCase();
        var stageKey = tab + '-' + index + '-' + uniqueId;

        var menuDisabled = !item;
        //const instructions = this.instructions[tab];

        var workspaceNode = this.renderStage();
        var headerNode = this.renderHeader();

        var unsavedKeys = Object.keys(unsaved);
        var unsavedCountNode = unsavedKeys.length ? React.createElement(
            'span',
            { className: 'stage__unsaved-count' },
            unsavedKeys.length
        ) : undefined;

        return React.createElement(
            'div',
            { className: className, key: stageKey },
            React.createElement(
                'div',
                { className: 'stage__menu' },
                React.createElement('button', { className: 'button button--transparent stage__back', onClick: this.back, disabled: !itemHistory.length, title: 'Back' }),
                React.createElement(
                    'button',
                    { className: 'button button--transparent stage__save-all', onClick: this.saveAll, disabled: !unsavedCountNode, title: 'Save All' },
                    unsavedCountNode
                ),
                React.createElement('span', { className: 'divider' }),
                React.createElement('button', { className: 'button button--transparent stage__save', onClick: this.save, disabled: menuDisabled, title: 'Save' }),
                React.createElement('button', { className: 'button button--transparent stage__delete', onClick: this.delete, disabled: menuDisabled, title: 'Delete' })
            ),
            React.createElement(
                'div',
                { className: 'stage__workspace' },
                workspaceNode
            )
        );
    },

    // -----------------------------
    renderStage: function renderStage() {
        var designer = this.props.designer;

        var selectedItem = this.getSelectedItem();

        if (!selectedItem && designer.tab !== 'Preview' && designer.tab !== 'Menu') {
            return React.createElement(Designer.Recent, null);
        }

        // Return a specific editing stage component.
        switch (designer.tab) {
            case CATEGORIES.TAGS:
                return React.createElement(Designer.Tag, null);
            case CATEGORIES.RULES:
                return React.createElement(Designer.Rule, null);
            case CATEGORIES.DEFINITIONS:
                return React.createElement(Designer.Definition, null);
            case 'Preview':
                return React.createElement(Designer.Preview, null);

            default:
                return React.createElement(Designer.Menu, null);
        }
    },

    // -----------------------------
    renderHeader: function renderHeader() {
        var selectedItem = this.getSelectedItem();
        if (!selectedItem) return '\xA0';

        return React.createElement(
            'span',
            { className: 'emphasis' },
            selectedItem.Name
        );
    },

    // -----------------------------
    save: function save() {
        this.props.dispatch(designerActions.saveModel());
    },

    // -----------------------------
    saveAll: function saveAll() {
        this.props.dispatch(coreActions.save());
    },

    // -----------------------------
    delete: function _delete() {
        this.props.dispatch(designerActions.delete());
    },

    // -----------------------------
    back: function back() {
        this.props.dispatch(designerActions.back());
    },

    // -----------------------------
    getSelectedItem: function getSelectedItem() {
        var _props15 = this.props,
            designer = _props15.designer,
            core = _props15.core;

        return (core[designer.tab] || [])[designer.index];
    }
});

// =====================================
// Container
// =====================================
Designer.Stage = connect(function (state) {
    return _extends({}, state);
})(Designer.__Stage);

// =====================================
// Presentation
// =====================================
Designer.__Definition = React.createClass({
    displayName: '__Definition',


    // -----------------------------
    render: function render() {
        var _this22 = this;

        var _props16 = this.props,
            designer = _props16.designer,
            core = _props16.core,
            dispatch = _props16.dispatch;
        var changeTab = designerActions.changeTab,
            openList = designerActions.openList,
            dialogTypes = designerActions.dialogTypes;


        var selectedItem = core.Definitions[designer.index];

        var update = function update(prop) {
            return _this22.updateModel.bind(_this22, prop);
        };

        var goToTags = function goToTags() {
            return dispatch(changeTab(CATEGORIES.TAGS));
        };
        var goToSettings = function goToSettings() {
            return dispatch(openList('Settings'));
        };

        // Edit Groups
        var openGroupEdit = function openGroupEdit() {
            return dispatch(commonActions.openDialog(dialogTypes.EDIT_GROUPS));
        };
        var groupEditnode = React.createElement(
            'button',
            { className: 'button button--link', onClick: openGroupEdit },
            'Edit Groups'
        );

        return React.createElement(
            'div',
            { className: 'edit edit--definition', ref: 'wrapper' },
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
                        value: selectedItem.Name,
                        onChange: update('Name') }),
                    React.createElement(Field, { label: 'Group',
                        id: 'group',
                        value: selectedItem.GroupId,
                        onChange: update('GroupId'),
                        options: core.Groups,
                        tooltip: 'Display group that this will be rendered inside of (Layout).',
                        after: groupEditnode }),
                    React.createElement(Field, { label: 'Control',
                        id: 'control',
                        value: selectedItem.ControlId,
                        onChange: update('ControlId'),
                        tooltip: 'Control that the user will use to modify the value(s).',
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
                React.createElement(
                    'a',
                    { className: 'button button--link', onClick: goToTags },
                    'Edit Tags'
                ),
                React.createElement(Designer.DefinitionTags, null)
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
                React.createElement(
                    'a',
                    { className: 'button button--link', onClick: goToSettings },
                    'Add Settings'
                ),
                React.createElement('div', { className: 'separator  separator--small' }),
                React.createElement(Designer.DefinitionSettings, null)
            ),
            React.createElement(Forge.Definition, { model: selectedItem })
        );
    },

    // -----------------------------
    updateModel: function updateModel(prop, value) {
        var _props17 = this.props,
            designer = _props17.designer,
            core = _props17.core,
            dispatch = _props17.dispatch;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        model[prop] = value;

        if (prop == 'ControlId') {
            // Get the new ControlName
            var control = core.Controls.filter(function (c) {
                return c.Id == value;
            })[0];
            model.ControlName = control && control.Name;
        }

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.Definition = connect(function (state) {
    return _extends({}, state);
})(Designer.__Definition);

// =====================================
// Presentation
// =====================================
Designer.__DefinitionSettings = React.createClass({
    displayName: '__DefinitionSettings',

    // -----------------------------
    render: function render() {

        var nestedSettings = this.nestRules().map(this.renderSetting);

        var contentNode = nestedSettings.length ? React.createElement(Sortable, { list: nestedSettings, onChange: this.updateOrder }) : 'No Settings Applied';

        return React.createElement(
            'div',
            { className: 'definition__settings' },
            contentNode
        );
    },

    // -----------------------------
    renderSetting: function renderSetting(setting, index) {
        var _this23 = this;

        var activeTagId = this.props.designer.activeTagId;

        var removeHandler = this.removeSetting.bind(this, setting);

        // If a Tag is being hovered over, we want the related setting
        // to display with some emphasis and allow the user to see which
        // settings are added by whic tags.
        var className = 'definition__setting';
        var afterNode = void 0;
        if (activeTagId && activeTagId === setting.TagId) className += ' definition__setting--active';
        if (setting.TagId) className += ' definition__rule';else afterNode = React.createElement('span', { className: 'definition__setting-remove', onClick: removeHandler });

        if (!afterNode) {
            var tagActivate = function tagActivate() {
                return _this23.props.dispatch(designerActions.activateTag(setting.TagId));
            };
            afterNode = React.createElement('span', { className: 'definition__rule-tag', title: 'Tagged Rule', onClick: tagActivate });
        }

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
            afterNode
        );

        if (setting.rules && setting.rules.length) {
            if (setting.rules.length > 1) className += ' definition__rule--many';
            // Map relevant rules underneath this setting so that
            // they can be displayed as children of this setting.
            var ruleNodes = setting.rules.map(function (r) {
                var ruleClassName = 'definition__nested-rule';
                if (activeTagId && activeTagId === r.TagId) ruleClassName += ' definition__nested-rule--active';
                return React.createElement(
                    'li',
                    { key: r.Name, className: ruleClassName },
                    React.createElement(
                        Field,
                        { label: r.Name },
                        React.createElement(
                            'span',
                            null,
                            r.Value
                        )
                    )
                );
            });

            return React.createElement(
                'div',
                { key: setting.SettingId, className: className },
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
                { key: setting.SettingId, className: className },
                primaryNodes
            );
        }
    },

    // -----------------------------
    renderControl: function renderControl(setting, index) {
        var controlName = setting.ControlName || setting.Control || 'Number';
        var controlProps = {
            Model: setting,
            onChange: this.valueChange.bind(this, setting.SettingId)
        };

        // Dynamically create the component based on Control name.
        return React.createElement(Forge.components.controls[controlName], controlProps);
    },

    // -----------------------------
    removeSetting: function removeSetting(setting) {
        var _props18 = this.props,
            dispatch = _props18.dispatch,
            core = _props18.core,
            designer = _props18.designer;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        // Update the value of one individual setting.


        var settings = [].concat(_toConsumableArray(model.Settings || []));
        var index = -1;

        model.Settings.some(function (s, i) {
            if (s.SettingId == setting.SettingId) {
                index = i;
                return true;
            }
        });

        settings.splice(index, 1);
        model.Settings = settings;

        dispatch(coreActions.updateDefinition(model));
    },

    // -----------------------------
    nestRules: function nestRules() {
        var _props19 = this.props,
            core = _props19.core,
            designer = _props19.designer;

        var selectedItem = core.Definitions[designer.index];
        var Settings = selectedItem.Settings,
            Rules = selectedItem.Rules;


        Settings = Settings || [];
        Rules = Rules || [];

        var settingIds = Settings.map(function (s) {
            return s.SettingId;
        });

        var flatSettings = Forge.utilities.sortSettings([].concat(_toConsumableArray(Settings), _toConsumableArray(Rules))).map(function (s) {
            var subRules = Rules.filter(function (r) {
                return (!r.TagId || r.TagId != s.TagId) && r.SettingId == s.SettingId;
            });
            return _extends({}, s, { rules: subRules });
        });

        return flatSettings.filter(function (s) {
            // Only show 1 rule per setting (rest are nested).
            if (s.TagId) {
                var index = settingIds.indexOf(s.SettingId);
                if (index === -1) settingIds.push(s.SettingId);
                return index === -1;
            }
            return true;
        });
    },

    // -----------------------------
    valueChange: function valueChange(settingId, value, ev) {
        var _props20 = this.props,
            dispatch = _props20.dispatch,
            core = _props20.core,
            designer = _props20.designer;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        // Update the value of one individual setting.


        var settings = [].concat(_toConsumableArray(model.Settings || []));

        settings.filter(function (s) {
            return s.SettingId === settingId;
        })[0]['Keys'] = value;

        model.Settings = settings;

        dispatch(coreActions.updateDefinition(model));
    },

    // -----------------------------
    updateOrder: function updateOrder(initialIndex, newIndex, handler) {
        var _props21 = this.props,
            dispatch = _props21.dispatch,
            designer = _props21.designer,
            core = _props21.core;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        // Use the handler given by the sortable to update the base array.


        var settings = handler(this.nestRules(), initialIndex, newIndex);
        var flatSettings = [];

        // Un-nest the settings in an order such that the nested rules have
        // have a Priority set just after its parent.
        settings.forEach(function (s) {
            return flatSettings = [].concat(_toConsumableArray(flatSettings), [s], _toConsumableArray(s.rules || []));
        });

        // Set Priority based on index.
        flatSettings.forEach(function (s, i) {
            return s.Priority = i;
        });

        var sortedSettings = Forge.utilities.sortSettings(flatSettings);
        model.Settings = sortedSettings.filter(function (s) {
            return !s.TagId;
        });
        model.Rules = sortedSettings.filter(function (s) {
            return !!s.TagId;
        });

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.DefinitionSettings = connect(function (state) {
    return _extends({}, state);
})(Designer.__DefinitionSettings);
// =====================================
// Presentation
// =====================================
Designer.__DefinitionTags = React.createClass({
    displayName: '__DefinitionTags',

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
                React.createElement(
                    'div',
                    { className: 'tags' },
                    tagNodes
                )
            )
        );
    },

    // -----------------------------
    getInitialState: function getInitialState() {
        return {};
    },

    // -----------------------------
    renderAddTag: function renderAddTag() {
        var _props22 = this.props,
            core = _props22.core,
            designer = _props22.designer;

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
        var _this24 = this;

        var _props23 = this.props,
            core = _props23.core,
            designer = _props23.designer,
            dispatch = _props23.dispatch;

        var selectedItem = core.Definitions[designer.index];

        // Map tags into spans that can be removed onClick
        return (selectedItem.Tags || []).map(function (tag, index) {
            var removeTagHandler = _this24.removeTag.bind(_this24, index);

            var clickHandler = function clickHandler() {
                var newId = tag.Id !== designer.activeTagId ? tag.Id : null;
                dispatch(designerActions.activateTag(newId));
            };

            var className = 'button button--secondary definition__tag';
            if (tag.Id === designer.activeTagId) className += ' definition__tag--active';

            return React.createElement(
                'button',
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
        var _props24 = this.props,
            core = _props24.core,
            designer = _props24.designer;

        var selectedItem = core.Definitions[designer.index];
        var newTags = [].concat(_toConsumableArray(selectedItem.Tags || []));

        // Remove the given tag from this array
        newTags.splice(index, 1);

        // Report the change
        this.reportChange(newTags);
    },

    // -----------------------------
    addTag: function addTag(tagId) {
        var _props25 = this.props,
            core = _props25.core,
            designer = _props25.designer;

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
        var _props26 = this.props,
            designer = _props26.designer,
            dispatch = _props26.dispatch,
            core = _props26.core;

        var model = _objectWithoutProperties(core.Definitions[designer.index], []);

        model.Tags = tags;

        dispatch(coreActions.updateDefinition(model));
    }
});

// =====================================
// Container
// =====================================
Designer.DefinitionTags = connect(function (state) {
    return _extends({}, state);
})(Designer.__DefinitionTags);
// =====================================
// Presentation
// =====================================
Designer.__Rule = React.createClass({
    displayName: '__Rule',


    // -----------------------------
    render: function render() {
        var _this25 = this;

        var _props27 = this.props,
            designer = _props27.designer,
            core = _props27.core;

        var selectedItem = core.Rules[designer.index];

        var update = function update(prop) {
            return _this25.updateModel.bind(_this25, prop);
        };
        var setting = core.Settings.filter(function (s) {
            return s.Id == selectedItem.SettingId;
        })[0];
        var controlNode = setting ? Forge.utilities.renderControl(setting, update('Keys')) : 'Choose a Setting type';

        return React.createElement(
            'div',
            { className: 'edit edit--rule field-group', ref: 'wrapper' },
            React.createElement(
                'div',
                { className: 'panel' },
                React.createElement(
                    'h4',
                    null,
                    'General'
                ),
                React.createElement(Field, { label: 'Name',
                    id: 'name',
                    value: selectedItem.Name,
                    onChange: update('Name') }),
                React.createElement(Field, { label: 'Tag',
                    id: 'tag',
                    value: selectedItem.TagId,
                    onChange: update('TagId'),
                    tooltip: 'Anything with this tag will receive the setting logic below.',
                    options: core.Tags }),
                React.createElement(Field, { label: 'Setting',
                    id: 'setting',
                    value: selectedItem.SettingId,
                    onChange: update('SettingId'),
                    tooltip: 'The logic which is applied to anything with the above tag.',
                    options: core.Settings }),
                React.createElement(
                    Field,
                    { label: 'Value', id: 'value' },
                    controlNode
                )
            )
        );
    },

    // -----------------------------
    updateModel: function updateModel(prop, value) {
        var _props28 = this.props,
            designer = _props28.designer,
            core = _props28.core,
            dispatch = _props28.dispatch;

        var model = _objectWithoutProperties(core.Rules[designer.index], []);

        model[prop] = value;

        dispatch(coreActions.updateRule(model));
    }

});

// =====================================
// Container
// =====================================
Designer.Rule = connect(function (state) {
    return _extends({}, state);
})(Designer.__Rule);

// =====================================
// Presentation
// =====================================
Designer.__Tag = React.createClass({
    displayName: '__Tag',


    // -----------------------------
    render: function render() {
        var _props29 = this.props,
            core = _props29.core,
            designer = _props29.designer;

        var selectedItem = core.Tags[designer.index];

        // Tags linked to Rules.
        var ruleNodes = core.Rules.filter(function (rule) {
            return rule.TagId && rule.TagId === selectedItem.Id;
        }).map(this.renderLink);

        // Tags linked to Definitions.
        var definitionNodes = core.Definitions.filter(function (d) {
            var defTags = (d.Tags || []).map(function (t) {
                return t.Id;
            });
            return d.Id && defTags.indexOf(selectedItem.Id) !== -1;
        }).map(this.renderLink);

        return React.createElement(
            'div',
            { className: 'edit edit--tag', ref: 'wrapper' },
            React.createElement(
                'div',
                { className: 'panel' },
                React.createElement(
                    'h4',
                    null,
                    'General'
                ),
                React.createElement(Field, { label: 'Name', id: 'tag-name', type: 'text', value: selectedItem.Name, onChange: this.updateTagName })
            ),
            React.createElement(
                'div',
                { className: 'panel edit__information' },
                React.createElement(
                    'h4',
                    null,
                    'Tagged Items'
                ),
                React.createElement(
                    'p',
                    { className: 'summary' },
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
        var dispatch = this.props.dispatch;

        var category = item.TagId ? 'Rules' : 'Definitions';

        return React.createElement(
            'li',
            { key: item.Id, className: 'list__item' },
            React.createElement(Designer.Link, { model: item, dispatch: dispatch, category: category, hideCategory: true })
        );
    },

    // -----------------------------
    updateTagName: function updateTagName(value) {
        var _props30 = this.props,
            designer = _props30.designer,
            core = _props30.core,
            dispatch = _props30.dispatch;

        var tag = _objectWithoutProperties(core.Tags[designer.index], []);

        tag.Name = value;

        dispatch(coreActions.updateTag(tag));
    }
});

// =====================================
// Container
// =====================================
Designer.Tag = connect(function (state) {
    return _extends({}, state);
})(Designer.__Tag);

var rootReducer = combineReducers({
    core: coreReducer,
    common: commonReducer,
    library: libraryReducer,
    designer: designerReducer,
    builder: builderReducer
});

var store = createStore(rootReducer, applyMiddleware(ReduxDebounce, ReduxThunk.default));