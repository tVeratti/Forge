// Require Jasmine's core files. Specifically, this requires and
// attaches all of Jasmine's code to the `jasmine` reference.
window.jasmine = jasmineRequire.core(jasmineRequire);

// Create the Jasmine environment.
// This is used to run all specs in a project.
const env = jasmine.getEnv();
env.catchExceptions(true);
env.throwOnExpectationFailure(true);

// Add all of the Jasmine global/public interface to the global scope, 
// so a project can use the public interface directly. 
// For example, calling `describe` in specs instead of `jasmine.getEnv().describe`.
const jasmineInterface = jasmineRequire.interface(jasmine, env);
for (var property in jasmineInterface) window[property] = jasmineInterface[property];

// ===============================================
const SpecRunner = React.createClass({

    // ----------------------------
    render: function () {
        const resultNodes = this.renderResults();

        return <ul>{resultNodes}</ul>;
    },

    // ----------------------------
    getInitialState: function(){
        return { results: [] };
    },

    // ----------------------------
    componentDidMount: function () {
        // This component receives/runs all test results.
        env.addReporter(this);
        env.execute();
    },

    // ----------------------------
    renderResults: function(){
        return this.state.results.map((r, i) => {
            const className = r.status === 'passed'
                ? 'fa fa-check'
                : 'fa fa-remove';

            const error = r.status === 'failed'
                ? this.renderError(r)
                : null;
            return (
                <li key={i}>
                    <label>
                        <span className={className}/>
                        {r.description}
                    </label>
                    {error}
                </li>
            );
        });
    },

    // ----------------------------
    renderError: function(r){
        const messages = r.failedExpectations.map((e, i) => <div key={i}>{e.message}</div>);
        return (
            <div className='spec-runner__error'>
                {messages}
            </div>
        );
    },

    // ----------------------------
    jasmineStarted: function (options) {
        this.setState({ started: true });
    },

    // ----------------------------
    suiteStarted: function (result) {
    },

    // ----------------------------
    suiteDone: function (result) {
    },

    // ----------------------------
    specStarted: function (result) {
    },

    // ----------------------------
    specDone: function (result) {
        this.setState({ results: [ 
            ...this.state.results,
            result
        ]});
    },

    // ----------------------------
    jasmineDone: function (doneResult) {
    }
        
});

// ===============================================
SpecRunner.Provider = (props) => (
    <Provider store={store}>
        <SpecRunner {...props} />
    </Provider>
);
