const { utilities, lifeCycle, CATEGORIES } = require('Core');
const { sortBy, getRules, sortSettings, contains } = utilities;

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

            updateAll(nextState, action);
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

            nextState.Definitions = updateAll(nextState, action);            
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

            nextState.Definitions = updateAll(nextState, action);
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
// Note: State is passed through to provide references
//      to the latest Rules, Settings, and Tags data which
//      is used to build Definitions.
function updateAll(state, action, stage = lifeCycle.stages.update){
    let definitions = [ ...state.Definitions ];
    const startTime = new Date().getTime();
    let updatedCount = 0;

    if (action.type === 'ADD_SETTING' || 
        action.category === CATEGORIES.DEFINITIONS){
        // Base updates on ONLY the actively edited Definition.
        // This will run updates for all dependant Definitions.
        updateDefinition(state, definitions[action.index]);
        updatedCount = 1;

    } else {
        // Update Definitions that are related to the object
        // being modified (All Definitions, Tag, or Rule...)
        definitions.forEach((model, index) =>{
            model.index = index;

            if (action.type !== 'RECEIVE_GAME'){
                // Only update if this Definition contains the modified Tag or Rule.
                switch(action.category) {
                    case CATEGORIES.TAGS:   if (!contains(model.Tags.map(t => t.Id), action.model.Id)) return; break;
                    case CATEGORIES.RULES:  if (!contains(model.Rules.map(r => r.Id), action.model.Id)) return; break;
                }
            }

            // Build Rules, Settings, Tree
            updateDefinition(state, model);
            updatedCount++;
        });
    }

    // Apply all Settings...
    definitions.forEach(applySettings.bind(this, stage, state));

    const elapsedTime = new Date().getTime() - startTime;
    console.log('end updateAll', elapsedTime, updatedCount);

    return definitions;
}

// --------------------------------
function updateDefinition(state, model){
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
        const target = Object.Keys(s.Keys).filter(k => targetKeys.indexOf(k.Key) > -1)[0];

        if (target){
            // Add the current definition to the tree
            // which tracks definition dependencies.
            state.tree[target.Value] = state.tree[target.Value] || [];
            state.tree[target.Value].push(model.Id);
        }
    });
}

// --------------------------------
// Recursively apply all settings to Definitions,
// and update all dependants thereafter.
function applySettings(stage, state, model, index){
    // Apply all settings that match the current lifecycle
    //let values = [ ...model.Values ];
    // model.MergedSettings
    //     .filter(s => lifeCycle.isActive(s.LifeCycle, stage))
    //     .forEach(s => values = settings.apply(value, s));
    
    // if (arrayChanged(values, model.Values)){
    //     // The value of this Definition has changed,
    //     // so update any Definitions that are depending on
    //     // its value (ValueIf, etc...)
    //     model.dependants.forEach(applySettings);
    // }
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