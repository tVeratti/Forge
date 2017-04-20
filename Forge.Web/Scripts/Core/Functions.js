Forge.settings = {
	Minimum: function(value, setting){
		return Math.max(+value, +setting);
	},
	Maximum: function(value, setting){
		return Math.min(+value, +setting);
	},
	Default: function(value, setting){
		var isNull = 
			value === null ||
			value === undefined;
		return isNull ? setting : value;
	}
};