const Forge = {};

Forge.stages = {
	init: 			'Initialize',
	initAndUpdate: 	'InitializeAndUpdate',
	update: 		'Update'
};

Forge.lifeCycle = [
	Forge.stages.init,
	Forge.stages.initAndUpdate,
	Forge.stages.update
];

Forge.components = {
	controls: {}
};

// Core Functions
// ---------------------------------
Forge.functions = {
	// -----------------------------
	getRules: function(tags, rules){
		const tagIds = tags.map(t => t.Id);

		// Merge rules into this list, adding the property IsRule = true.
		const definitionRules = rules.filter(r => tagIds.indexOf(+r.TagId) > -1);

		return definitionRules.map(rule => {
			// Return as a new DefinitionSettingModel
			return {
				...rule,
				Id: `${rule.SettingId}-${rule.TagId}`
			};
		});
	},

	// -----------------------------
	sortSettings: function(settings){
		return settings.sort(function(settingA, settingB){
			if (settingA.Priority > settingB.Priority) return 1;
			if (settingA.Priority < settingB.Priority) return -1;
			if (!!settingA.TagId && !settingB.TagId) return -1;
			if (!!settingB.TagId && !settingA.TagId) return 1;
			return 0;
		});
	},

	// -----------------------------
	isSettingAlive: function(settingLifeCycle, currentLifeCycle){
		const index = Forge.lifeCycle.indexOf(settingLifeCycle);
		switch(currentLifeCycle){
			case Forge.stages.init: return index === 0 || index === 1;
			case Forge.stages.update: return index === 1 || index === 2;
			default: return false;
		}
	}
};
