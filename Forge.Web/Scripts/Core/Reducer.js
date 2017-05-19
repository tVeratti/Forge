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
                d.Settings = Forge.utilities.sortSettings([
                    ...d.Settings,
                    ...Forge.utilities.getRules(d.Tags, nextState.Rules)
                ]);
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

            let updateIds = [];
            switch(action.category){
                // Rules
                case CATEGORIES.RULES: 
                    updateIds = state.Definitions
                        .filter(d => {
                            return d.Settings.filter(s => {
                                return s.TagId === action.model.TagId 
                                    || s.SettingId === action.model.SettingId;
                            })[0];
                        })
                        .map(d => d.Id); break;

                // Update dependent children.
                case CATEGORIES.DEFINITIONS: 
                    state.Definitions.forEach(d => {
                        updateIds = [ ...updateIds, ...(d.Children || []) ];
                    });
                    break;
            }

            nextState.updateIds = updateIds;

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