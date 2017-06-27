const initialCoreState = {
    loading: true,
    saving: false,
    conflict: false,

    Game:           {},
    Rules:          [],
    Definitions:    [],
    Settings:       [],
    Tags:           [],
    Controls:       [],
    Groups:         []
}

// =====================================
function coreReducer(state = initialCoreState, action){
    const { getRules, sortSettings } = Forge.utilities;

    let nextState = { ...state };

    switch(action.type){
        // --------------------------------
        case REQUEST_GAME:
            var localGame = getGameFomLocalStorage(action.id) || initialCoreState;
            nextState = { ...localGame, loading: true };

            break;

        // --------------------------------
        case GET_LOCAL_GAME:
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
        case RECEIVE_GAME:
            nextState = {
                ...nextState,
                ...(action.game || localGame),
                loading: false,
                saving: false
            };

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
        case CREATE_ITEM:
            // New item with temporary Id
            let newItem = {
                Id: action.id,
                Name: `New ${action.category.slice(0, -1)}`
            };

            switch(action.category){
                case CATEGORIES.RULES:
                    newItem = {
                        ...newItem,
                        TagId: state.Tags[0].Id,
                        SettingId: state.Settings[0].Id
                    };
                    break;

                case CATEGORIES.DEFINITIONS:
                    newItem = {
                        ...newItem,
                        Category: action.category,
                        ControlId: state.Controls[0].Id,
                        GroupId: state.Groups[0].Id,
                        Settings: [],
                        Tags: [],
                        Rules: [],
                        MergedSettings: [],
                        unsaved: true
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
        case UPDATE_ITEM:
            const items = [ ...state[action.category] ];
            items[action.index] = {
                ...items[action.index],
                ...action.model,
                unsaved: !action.saved
            };

            nextState[action.category] = items;

            let calculateAll = false;
            switch(action.category){
                case CATEGORIES.TAGS:
                case CATEGORIES.RULES:
                    calculateAll = true;
                    nextState.Rules = nextState.Rules.map(r => {
                        const tag = nextState.Tags.filter(t => t.Id == r.TagId)[0] || {};
                        const setting = nextState.Settings.filter(s => s.Id == r.SettingId)[0] || {};
                        return {
                            ...r,
                            Name: `${tag.Name || '-'} ${setting.Name || '-'}`,
                            error: !tag.Name || !setting.Name
                        }
                    });

                // NO BREAK
                case CATEGORIES.DEFINITIONS:
                    if (!action.fromCore) {
                        nextState.Definitions.forEach(d => {
                            if (calculateAll || d.Id == action.model.Id) {
                                d.Rules = getRules(nextState, d);
                                d.MergedSettings = sortSettings([ ...d.Rules, ...d.Settings ])
                                    .filter(s => !s.overridden);
                            }
                        });
                    }
                    break;
            }
            
            setGameToLocalStorage(nextState);
            break;

        // --------------------------------
        case DELETE_ITEM:
            nextState[action.tab] = state[action.tab].slice();
            nextState[action.tab].splice(action.model.index, 1);
            nextState[action.tab].forEach((x, i) => x.index = i);
            break;

        // --------------------------------
        case ADD_SETTING:
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
            setGameToLocalStorage(nextState);
            break;
        
        // --------------------------------
        case UPDATE_GAME:
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