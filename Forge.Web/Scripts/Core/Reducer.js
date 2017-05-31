const initialCoreState = {
    loading: true,
    saving: false,

    updateIds: [],

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
    
    let nextState = { ...state };

    switch(action.type){
        // --------------------------------
        case REQUEST_GAME:
            nextState.loading = true;
            break;

        // --------------------------------
        case RECEIVE_GAME:

            nextState = {
                ...nextState,
                ...action.game
            };

            nextState.Definitions.forEach((d, i) => {
                d.index = i;

                // Combine Settings & Rules, then sort by Priority.
                const settings = (d.Settings || []).filter(s => !s.TagId);
                const rules = Forge.utilities.getRules(d.Tags, nextState.Rules);
                d.Settings = Forge.utilities.sortSettings([ ...settings, ...rules ]);
            });

            nextState.loading = false;
            nextState.saving = false;
            break;

        // --------------------------------
        case CREATE_ITEM:
            // New item with temporary Id
            const newItem = {
                Name: `New ${action.category.slice(0, -1)}`,
                TempId: `t-${Math.random()}`
            };

            nextState[action.category] = [ 
                ...nextState[action.category],
                newItem
            ];

            break;

        // --------------------------------
        case UPDATE_ITEM:
            const items = [ ...state[action.category] ];

            items[action.index] = {
                ...items[action.index],
                ...action.model
            };

            nextState[action.category] = items;
            switch(action.category){
                case CATEGORIES.RULES: 
                case CATEGORIES.TAGS:
                    // Re-Calculate all Definitions' Settings
                    nextState.Definitions = state.Definitions.map(d => {
                        const settings = (d.Settings || []).filter(s => !s.TagId);
                        const rules = Forge.utilities.getRules(d.Tags, nextState.Rules);

                        d.Settings = Forge.utilities.sortSettings([ ...settings, ...rules ]);
                    });
                    break;
            }


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
            const settingExists = (definition.Settings || []).filter(s => s.Name === action.setting.Name)[0];

            if (!settingExists) {
                definition.Settings = [ ...definition.Settings || [], definitionSetting ];
            }

            // Upate the state array with the updated object.
            definitions[action.index] = definition;
            nextState.Definitions = definitions;
            break;
    }

    return nextState;
}