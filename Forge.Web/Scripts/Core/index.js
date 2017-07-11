exports.settings =  require('./Settings.js');
exports.utilities = require('./Utilities.js');
exports.lifeCycle = require('./LifeCycle.js');
exports.actions =   require('./Actions.js');

// Controls
[
    'Dictionary',
    'Number',
    'Select_Definition',
    'Text'
].forEach(c => exports[c] = require(`./Components/Controls/${c}.jsx`));