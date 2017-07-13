const { settings, utilities, CATEGORIES } = require('Core');
const { getRules, sortSettings } = settings;
const { sortBy } = utilities;

const initialState = {
    loading: true,
    saving: false,
    unsaved: {},
    conflict: false,

    tree: {},

    Game:           {},
    Rules:          [],
    Definitions:    [],
    Settings:       [],
    Tags:           [],
    Controls:       [],
    Groups:         []
}

// =====================================
function coreReducer(state = initialState, action){
    const { getRules, sortSettings } = utilities;

    let nextState = { ...state };

    switch(action.type){
        // --------------------------------
        case 'REQUEST_GAME':
            var localGame = getGameFomLocalStorage(action.id) || initialState;
            nextState = { ...localGame, loading: true };

            break;

        // --------------------------------
        case 'GET_LOCAL_GAME':
            // Check for a game that was saved to local and compare
            // it to what was retrieved from the database.
            var localGame = getGameFomLocalStorage(action.id);
            if (action.game){
                let localTime = localGame.Game.ModifiedDate;
                let serverTime = action.game.ModifiedDate;
                if (localTime != serverTime){
                    // The game saved in localStorage was updated at a different time
                    // than what was found in the database. Ask the user to decide which
                    // copy to keep.
                    nextState.conflict = {
                        localTime,
                        serverTime
                    };

                    return nextState;
                }
            }

            // NO BREAK, FALL-THROUGH...
            // Same prep code for Local & DB.

        // --------------------------------
        case 'RECEIVE_GAME':
            nextState = {
                ...nextState,
                ...(action.game || localGame),
                loading: false,
                saving: false
            };

            nextState.Groups = sortBy(nextState.Groups, 'Order');
            nextState.Rules.forEach((r, i) => r.index = i);
            nextState.Tags.forEach((t, i) => t.index = i);

            nextState.Definitions = nextState.Definitions.map((d, i) => {
                // Get Rules & merge with Settings.
                const Rules = getRules(nextState, d);
                const MergedSettings = sortSettings([ ...Rules, ...d.Settings ]).filter(s => !s.overridden);
                return { ...d, index: i, Rules, MergedSettings };
            });

            setGameToLocalStorage(nextState);
            break;

        // --------------------------------
        case 'CREATE_ITEM':
            // New item with temporary Id
            let newItem = {
                Id: action.id,
                Name: `New ${action.category.slice(0, -1)}`
            };

            switch(action.category){
                case CATEGORIES.DEFINITIONS:
                    newItem = {
                        ...newItem,
                        Category: action.category,
                        Settings: [],
                        Tags: [],
                        Rules: [],
                        MergedSettings: []
                    };
                break;
            }

            nextState[action.category] = [ 
                ...nextState[action.category],
                newItem
            ];

            nextState[action.category].forEach((x, i) => x.index = i);
            setGameToLocalStorage(nextState);

            break;

        // --------------------------------
        case 'UPDATE_ID':
            var index, items = [ ...state[action.tab] ];
            items.forEach((x, i) => index = x.Id === action.oldId ? i : index);
            items[index].Id = action.newId;
            
            nextState[action.tab] = items;
            break;

        // --------------------------------
        case 'UPDATE_ITEM':
            var items = [ ...state[action.category] ];
            items[action.index] = {
                ...items[action.index],
                ...action.model,
                unsaved: !action.saved
            };

            nextState[action.category] = items;

            // Update the count of total unsaved items.
            const unsavedKey = `${action.category}-${action.model.Id}`;
            if (!action.saved) nextState.unsaved[unsavedKey] = true;
            else delete nextState.unsaved[unsavedKey];

            updateAll(nextState);            
            setGameToLocalStorage(nextState);
            break;

        // -------------------------------- 
        case 'UPDATE_GROUPS':
            nextState.Groups = sortBy(action.result, 'Order');
            break;

        // --------------------------------
        case 'DELETE_ITEM':
            nextState[action.tab] = state[action.tab].slice();
            nextState[action.tab].splice(action.model.index, 1);
            nextState[action.tab].forEach((x, i) => x.index = i);
            break;

        // --------------------------------
        case 'ADD_SETTING':
            var definitions = [ ...state.Definitions ];
            var { ...definition } = definitions[action.index];

            // The setting becomes a new DefinitionSetting - it has
            // relationship values that are specific to the way this
            // Definition object implements the Setting.
            const { ...definitionSetting } = action.setting;
           
            // Only add the setting if the new setting is unique.
            const settingExists = (definition.Settings || []).filter(s => s.SettingId === action.setting.Id)[0];

            if (!settingExists) {
                definition.Settings = [ ...definition.Settings || [], {
                    ...definitionSetting,
                    Id: null,
                    DefinitionId: definition.Id,
                    SettingId: definitionSetting.Id,
                    Priority: 0
                 }];
            }

            definition.unsaved = true;

            // Upate the state array with the updated object.
            definitions[action.index] = definition;
            nextState.Definitions = definitions;

            updateAll(nextState);
            setGameToLocalStorage(nextState);
            break;
        
        // --------------------------------
        case 'UPDATE_GAME':
            nextState.Game = {
                ...state.Game,
                ...action.model
            };

            break;
    }

    return nextState;
}

// --------------------------------
function setGameToLocalStorage(state){
    const { Id } = state.Game;
    if (Id){
        try {
            const gameJSON = JSON.stringify(state);
            localStorage.setItem(`core_${Id}`, gameJSON);
        } catch(err) { console.warn('Error saving game to local storage.', err); }
    }
}

// --------------------------------
function getGameFomLocalStorage(id){
    if (id){
        try {
            const gameJSON = localStorage.getItem(`core_${id}`);
            if (gameJSON) return JSON.parse(gameJSON);
        } catch(err) { console.warn('Error retrieving game from local storage.', err); }
    }
}

// --------------------------------
// 1. Merge Rules & Settings.
// 2. Build Dependency Tree.
// 3. Apply all Settings (Recursive, tree).
function updateAll(state, stage = lifeCycle.stages.update){
    const { Definitions } = state;

    Definitions.forEach(model =>{
        // Build MergedSettings (Rules + Settings).
        model.Rules = getRules(state, model);
        model.MergedSettings = sortSettings([ 
                ...model.Rules,
                ...model.Settings ])
            .filter(s => !s.overridden);
        
        // Prepare tree references...
        model.MergedSettings.forEach(s => {
            // Get any settings keys which target an 
            // outside definitionId (Target, TargetId).
            const targetKeys = ['Target', 'TargetId'];
            const target = s.Keys.filter(k => targetKeys.indexOf(k.Key) > -1)[0];

            if (target){
                // Add the current definition to the tree
                // which tracks definition dependencies.
                tree[target.Value] = tree[target.Value] || [];
                tree[target.Value].push(model.Id);
            }
        })
    })

    // Apply all Settings...
    Definitions.forEach(applySettings.bind(this, stage, state));
}

// --------------------------------
// Recursively apply all settings to Definitions,
// and update all dependants thereafter.
function applySettings(model, index, stage, state){
    console.log('applySettings', model.Name)
    // Apply all settings that match the current lifecycle
    let values = [ ...model.Values ];
    // model.MergedSettings
    //     .filter(s => lifeCycle.isActive(s.LifeCycle, stage))
    //     .forEach(s => values = settings.apply(value, s));
    
    if (arrayChanged(values, model.Values)){
        // The value of this Definition has changed,
        // so update any Definitions that are depending on
        // its value (ValueIf, etc...)
        model.dependants.forEach(applySettings);
    }
}

function arrayChanged(a, b){
    let changed = false;
    a.some((x, i) => {
        if (x == b[i]){
            changed = true;
            return true;
        }
    });

    return change;
}

module.exports = coreReducer;