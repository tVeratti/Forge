// User Preference Store
// ================================================
// Store user preferences in localStorage AND Database.
// Fetch first from localStorage, fallback to DB.
var userStore = new UserPreferenceStore();

function UserPreferenceStore() {
    var self = this;

    // An array of fields that the user wishes
    // to see on their designer preview tiles
    // (Defaults)
    self.previewFields = {
    	loaded: false,
    	tags: [
    		'Name'
    	],
    	rules: [
    		'TagName',
    		'SettingName',
    		'Value'
		],
    	definitions: [
    		'Name',
    		'Tags'
    	]
    };

    return self;
}