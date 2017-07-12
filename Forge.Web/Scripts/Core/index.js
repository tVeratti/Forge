exports.settings =  require('./Settings.js');
exports.utilities = require('./Utilities.js');
exports.lifeCycle = require('./LifeCycle.js');
exports.actions =   require('./Actions.js').actions;
exports.CATEGORIES =   require('./Actions.js').CATEGORIES;

// Controls
exports.controls = {};
// [
//     'Dictionary',
//     'Number',
//     'Select_Definition',
//     'Text'
// ].forEach(c => exports.controls[c] = require(`./Components/Controls/${c}.jsx`));