const React = require('react');

const Dialog = require('Common/Components/Dialog.jsx');

const LoadError = () => {
    return (
        <Dialog header='Connection Failed'>
            The Designer could not be loaded. You may continue working in offline mode,
            but your changes will not be committed to the database until your connection resumes.
        </Dialog>
    )
};

module.exports = LoadError;