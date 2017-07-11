// Core Functions
// =====================================
const utilities = {
	renderControl: function(item, onChange){
		// Dynamically create the component based on Control name.
        return React.createElement(
            Forge.components.controls[item.Control || item.ControlName || 'Text'], 
            { Model: item, onChange }
        );
	},

	// -----------------------------
	getRules: function(state, definition){
		const { Rules, Tags } = state;

		definition.Rules = definition.Rules || [];
		definition.Tags = definition.Tags || [];

		// Get all Rules associated to the Definition by Tags.
		const definitionTags = definition.Tags
			.map(t => +t.Id);

		// Remove rules no longer associated by a Tag.
		// This will happen when a Tag has been removed from the Definition.
		let definitionRules = definition.Rules
			.filter(r => definitionTags.indexOf(+r.TagId) > -1);

		// Add/Update all Rules from core.
		Rules
			.filter(r => definitionTags.indexOf(+r.TagId) > -1)
			.forEach(r => {
				const match = definitionRules.filter(dr => dr.TagId == r.TagId &&  dr.SettingId == r.SettingId)[0];
				if (!match){
					// Add this rule.
					definitionRules.push({ ...r, Priority: definitionRules.length -1 });
				} else {
					// Update the rule.
					const index = definitionRules.indexOf(match);
					definitionRules[index] = {
						...match, ...r,
						// Maintain the Priority!!
						Priority: match.Priority
					}
				}
			});

		return definitionRules.map(rule => {
			// Check if there's a local setting that overrides this rule,
			// Or a Rule with a higher Priority...
			const overridden = !!(
				definition.Settings.filter(s => s.Id == rule.SettingId)[0]
				|| definitionRules.filter(s => s.SettingId == rule.SettingId && s.Priority < rule.Priority)[0]
			);

			// Return as a new DefinitionSettingModel
			return {
				...rule,
				Id: `${rule.SettingId}-${rule.TagId}`,
				overridden
			};
		}).filter(r => !!r.TagId);
	},

	// -----------------------------
	sortSettings: function(settings){
		return (settings || []).sort(function(a, b){
			if (a.Priority > b.Priority) return 1;
			if (a.Priority < b.Priority) return -1;
			
			return 0;
		});
	},

	// -----------------------------
	getDefinitionSettings: (state, definition) => {
		const rules = Forge.utilities.getRules(state, definition);
		return Forge.utilities.sortSettings([ ...definition.Settings, ...rules ]);
	},

	debounceAction: (thunk, key, time = 500) => { 
		return Object.assign(thunk, { meta: { debounce: { time, key }}});
	},

	// --------------------------------
	contains: (array, item) => { return array.indexOf(item) !== -1; },

	// --------------------------------
	debounce: (func, wait, immediate) => {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	},

	// --------------------------------
	sortBy: (arr, prop) => {
		return arr.sort((a, b) => {
			if (a[prop] > b[prop]) return 1;
			if (a[prop] < b[prop]) return -1;
			return 0;
		});
	}
}

module.exports = utilities;