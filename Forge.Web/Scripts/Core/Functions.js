Forge.settings = {
	Minimum: function(value, setting){
		if (isNaN(value)) value = 0;
		return Math.max(+value, +setting);
	},
	Maximum: function(value, setting){
		if (isNaN(value)) value = 0;
		return Math.min(+value, +setting);
	},
	Default: function(value, setting){
		return value || setting;
	}
};