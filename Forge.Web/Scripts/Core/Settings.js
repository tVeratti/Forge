const store = require('Store.js');

// Definition Settings
// =====================================
const settings = {
	apply: function(keys, setting) {
		const { SettingName, Name } = setting;
		return this[SettingName || Name](keys, setting);
	},

	// --------------------------------
	Minimum: function(keys, setting){
		if (isNaN(keys.Value)) keys.Value = 0;

		keys.Value = Math.max(
			+keys.Value, 
			+(setting.Keys.Value || 0)
		);

		return keys;
	},

	// --------------------------------
	Maximum: function(keys, setting){
		if (isNaN(keys.Value)) keys.Value = 0;

		keys.Value = Math.min(
			+keys.Value, 
			+(setting.Keys.Value || 0)
		);
		
		return keys;
	},

	// --------------------------------
	Default: function(keys, setting){
		keys.Value = keys.Value || setting.Keys.Value;
		return keys;
	},

	// --------------------------------
	ValueIf: function(keys, setting){
		const { Definitions } = store.getState().core;
		const target = Definitions.filter(d => d.Id === setting.RelatedId)[0];
		keys.Value = target && target.Value === setting.RelatedValue
			? setting.Keys.Value
			: keys.Value;
		return keys;
	}
};

module.exports = settings;