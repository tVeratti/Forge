// Core Functions
// =====================================
Forge.utilities = {
	// -----------------------------
	getRules: function(tags, rules){
		tags = tags || [];
		rules = rules || [];

		const tagIds = tags.map(t => +t.Id);

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
		return (settings || []).sort(function(a, b){
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
const debounceAction = (thunk, key, time = 500) => { 
    return Object.assign(thunk, { meta: { debounce: { time, key }}});
};

// --------------------------------
const contains = (array, item) => array.indexOf(item) !== -1;

// --------------------------------
function debounce(func, wait, immediate) {
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
};

// --------------------------------
const sortBy = (arr, prop) => {
    return arr.sort((a, b) => {
        if (a[prop] > b[prop]) return 1;
        if (a[prop] < b[prop]) return -1;
        return 0;
    });
}