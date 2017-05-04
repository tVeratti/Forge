'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Require Jasmine's core files. Specifically, this requires and
// attaches all of Jasmine's code to the `jasmine` reference.
window.jasmine = jasmineRequire.core(jasmineRequire);

// Create the Jasmine environment.
// This is used to run all specs in a project.
var env = jasmine.getEnv();
env.catchExceptions(true);
env.throwOnExpectationFailure(true);

// Add all of the Jasmine global/public interface to the global scope, 
// so a project can use the public interface directly. 
// For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
var jasmineInterface = jasmineRequire.interface(jasmine, env);
for (var property in jasmineInterface) {
    window[property] = jasmineInterface[property];
} // ===============================================
var SpecRunner = React.createClass({
    displayName: 'SpecRunner',


    // ----------------------------
    render: function render() {
        var resultNodes = this.renderResults();

        return React.createElement(
            'ul',
            null,
            resultNodes
        );
    },

    // ----------------------------
    getInitialState: function getInitialState() {
        return { results: [] };
    },

    // ----------------------------
    componentDidMount: function componentDidMount() {
        // This component receives/runs all test results.
        env.addReporter(this);
        env.execute();
    },

    // ----------------------------
    renderResults: function renderResults() {
        var _this = this;

        return this.state.results.map(function (r, i) {
            var className = r.status === 'passed' ? 'fa fa-check' : 'fa fa-remove';

            var error = r.status === 'failed' ? _this.renderError(r) : null;
            return React.createElement(
                'li',
                { key: i },
                React.createElement(
                    'label',
                    null,
                    React.createElement('span', { className: className }),
                    r.description
                ),
                error
            );
        });
    },

    // ----------------------------
    renderError: function renderError(r) {
        var messages = r.failedExpectations.map(function (e, i) {
            return React.createElement(
                'div',
                { key: i },
                e.message
            );
        });
        return React.createElement(
            'div',
            { className: 'spec-runner__error' },
            messages
        );
    },

    // ----------------------------
    jasmineStarted: function jasmineStarted(options) {
        this.setState({ started: true });
    },

    // ----------------------------
    suiteStarted: function suiteStarted(result) {},

    // ----------------------------
    suiteDone: function suiteDone(result) {},

    // ----------------------------
    specStarted: function specStarted(result) {},

    // ----------------------------
    specDone: function specDone(result) {
        this.setState({ results: [].concat(_toConsumableArray(this.state.results), [result]) });
    },

    // ----------------------------
    jasmineDone: function jasmineDone(doneResult) {}

});

// ===============================================
SpecRunner.Provider = function (props) {
    return React.createElement(
        Provider,
        { store: store },
        React.createElement(SpecRunner, props)
    );
};

var _enzyme = enzyme,
    shallow = _enzyme.shallow,
    mount = _enzyme.mount;

// =============================================

describe('Core > Definition', function () {
    var options = [{ Id: 1, Display: 'One' }, { Id: 2, Display: 'Two' }, { Id: 3, Display: 'Three' }];

    var options2 = [{ Id: 4, Display: 'Four' }, { Id: 5, Display: 'Five' }, { Id: 6, Display: 'Six' }];

    // ------------------------------
    beforeEach(function () {});

    // ======================================================================
    describe('Render: ', function () {

        // ------------------------------
        it('can render a Number control', function () {
            var props = {
                model: { Control: 'Number' }
            };

            var node = mount(React.createElement(Forge.Definition, _extends({ store: store }, props)));
            var control = node.find(Forge.components.controls.Number);

            expect(control.length).toBe(1);
        });

        // ------------------------------
        it('can render a Text control', function () {
            var props = {
                model: { Control: 'Text' }
            };

            var node = mount(React.createElement(Forge.Definition, _extends({ store: store }, props)));
            var control = node.find(Forge.components.controls.Text);

            expect(control.length).toBe(1);
        });
    });
});