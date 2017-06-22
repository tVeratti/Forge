// Definition Settings
// =====================================
Forge.settings = {
	apply: function(value, setting) {
		const { SettingName, Name } = setting;
		return this[SettingName || Name](value, setting);
	},

	// --------------------------------
	Minimum: function(value, setting){
		if (isNaN(value)) value = 0;
		return Math.max(+value, +setting.Value);
	},

	// --------------------------------
	Maximum: function(value, setting){
		if (isNaN(value)) value = 0;
		return Math.min(+value, +setting.Value);
	},

	// --------------------------------
	Default: function(value, setting){
		return value || setting.Value;
	},

	// --------------------------------
	ValueIf: function(value, setting){
		const { Definitions } = store.getState().core;
		const target = Definitions.filter(d => d.Id === setting.RelatedId)[0];
		return target && target.Value === setting.RelatedValue
			? setting.Value
			: value;
	}
};