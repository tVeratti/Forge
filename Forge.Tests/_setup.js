// JSDOM mimicks the API of a browser, allowing us to mount components
// within our tests, outside of a full browser (document, createElement, etc.)
const JSDOM = require('jsdom').JSDOM;

const window = new JSDOM('<!doctype html><html><body></body></html>').window;

global.document = window.document;
global.window = window;

// Copy JSDOM API attributes over to
// Mocha's global space where React will reference.
for (var key in window) {
    if (!window.hasOwnProperty(key)) continue
    if (key in global) continue
    global[key] = window[key]
}