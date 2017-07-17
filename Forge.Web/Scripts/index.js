global.React = require('react');
global.ReactDOM = require('react-dom');

const Nav =         require('Common/Components/Nav.jsx');
const Footer =      require('Common/Components/Footer.jsx');

const Account =     require('Account/Components/Account.jsx');
const Builder =     require('Builder/Components/Builder.jsx');
const Designer =    require('Designer/Components/Designer.jsx');
const Library =     require('Library/Components/Library.jsx');

global.Forge = {
    Nav,
    Footer,
    Account,
    Builder,
    Designer,
    Library
};

