﻿!function (t, e) { "object" == typeof exports && "object" == typeof module ? module.exports = e(require("react"), require("redux")) : "function" == typeof define && define.amd ? define(["react", "redux"], e) : "object" == typeof exports ? exports.ReactRedux = e(require("react"), require("redux")) : t.ReactRedux = e(t.React, t.Redux) }(this, function (t, e) { return function (t) { function e(o) { if (r[o]) return r[o].exports; var n = r[o] = { exports: {}, id: o, loaded: !1 }; return t[o].call(n.exports, n, n.exports, e), n.loaded = !0, n.exports } var r = {}; return e.m = t, e.c = r, e.p = "", e(0) }([function (t, e, r) { "use strict"; function o(t) { return t && t.__esModule ? t : { "default": t } } e.__esModule = !0, e.connect = e.Provider = void 0; var n = r(4), s = o(n), i = r(5), a = o(i); e.Provider = s["default"], e.connect = a["default"] }, function (e, r) { e.exports = t }, function (t, e, r) { "use strict"; e.__esModule = !0; var o = r(1); e["default"] = o.PropTypes.shape({ subscribe: o.PropTypes.func.isRequired, dispatch: o.PropTypes.func.isRequired, getState: o.PropTypes.func.isRequired }) }, function (t, e) { "use strict"; function r(t) { "undefined" != typeof console && "function" == typeof console.error && console.error(t); try { throw Error(t) } catch (e) { } } e.__esModule = !0, e["default"] = r }, function (t, e, r) { "use strict"; function o(t) { return t && t.__esModule ? t : { "default": t } } function n(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function s(t, e) { if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return !e || "object" != typeof e && "function" != typeof e ? t : e } function i(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e) } e.__esModule = !0, e["default"] = void 0; var a = r(1), p = r(2), u = o(p), c = r(3), f = (o(c), function (t) { function e(r, o) { n(this, e); var i = s(this, t.call(this, r, o)); return i.store = r.store, i } return i(e, t), e.prototype.getChildContext = function () { return { store: this.store } }, e.prototype.render = function () { var t = this.props.children; return a.Children.only(t) }, e }(a.Component)); e["default"] = f, f.propTypes = { store: u["default"].isRequired, children: a.PropTypes.element.isRequired }, f.childContextTypes = { store: u["default"].isRequired } }, function (t, e, r) { "use strict"; function o(t) { return t && t.__esModule ? t : { "default": t } } function n(t, e) { if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function") } function s(t, e) { if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return !e || "object" != typeof e && "function" != typeof e ? t : e } function i(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e) } function a(t) { return t.displayName || t.name || "Component" } function p(t, e) { try { return t.apply(e) } catch (r) { return T.value = r, T } } function u(t, e, r) { var o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, u = !!t, h = t || x, d = void 0; d = "function" == typeof e ? e : e ? (0, v["default"])(e) : C; var y = r || M, b = o.pure, g = void 0 === b ? !0 : b, m = o.withRef, O = void 0 === m ? !1 : m, D = g && y !== M, j = _++; return function (t) { function e(t, e, r) { var o = y(t, e, r); return o } var r = "Connect(" + a(t) + ")", o = function (o) { function a(t, e) { n(this, a); var i = s(this, o.call(this, t, e)); i.version = j, i.store = t.store || e.store, (0, w["default"])(i.store, 'Could not find "store" in either the context or ' + ('props of "' + r + '". ') + "Either wrap the root component in a <Provider>, " + ('or explicitly pass "store" as a prop to "' + r + '".')); var p = i.store.getState(); return i.state = { storeState: p }, i.clearCache(), i } return i(a, o), a.prototype.shouldComponentUpdate = function () { return !g || this.haveOwnPropsChanged || this.hasStoreStateChanged }, a.prototype.computeStateProps = function (t, e) { if (!this.finalMapStateToProps) return this.configureFinalMapState(t, e); var r = t.getState(), o = this.doStatePropsDependOnOwnProps ? this.finalMapStateToProps(r, e) : this.finalMapStateToProps(r); return o }, a.prototype.configureFinalMapState = function (t, e) { var r = h(t.getState(), e), o = "function" == typeof r; return this.finalMapStateToProps = o ? r : h, this.doStatePropsDependOnOwnProps = 1 !== this.finalMapStateToProps.length, o ? this.computeStateProps(t, e) : r }, a.prototype.computeDispatchProps = function (t, e) { if (!this.finalMapDispatchToProps) return this.configureFinalMapDispatch(t, e); var r = t.dispatch, o = this.doDispatchPropsDependOnOwnProps ? this.finalMapDispatchToProps(r, e) : this.finalMapDispatchToProps(r); return o }, a.prototype.configureFinalMapDispatch = function (t, e) { var r = d(t.dispatch, e), o = "function" == typeof r; return this.finalMapDispatchToProps = o ? r : d, this.doDispatchPropsDependOnOwnProps = 1 !== this.finalMapDispatchToProps.length, o ? this.computeDispatchProps(t, e) : r }, a.prototype.updateStatePropsIfNeeded = function () { var t = this.computeStateProps(this.store, this.props); return this.stateProps && (0, P["default"])(t, this.stateProps) ? !1 : (this.stateProps = t, !0) }, a.prototype.updateDispatchPropsIfNeeded = function () { var t = this.computeDispatchProps(this.store, this.props); return this.dispatchProps && (0, P["default"])(t, this.dispatchProps) ? !1 : (this.dispatchProps = t, !0) }, a.prototype.updateMergedPropsIfNeeded = function () { var t = e(this.stateProps, this.dispatchProps, this.props); return this.mergedProps && D && (0, P["default"])(t, this.mergedProps) ? !1 : (this.mergedProps = t, !0) }, a.prototype.isSubscribed = function () { return "function" == typeof this.unsubscribe }, a.prototype.trySubscribe = function () { u && !this.unsubscribe && (this.unsubscribe = this.store.subscribe(this.handleChange.bind(this)), this.handleChange()) }, a.prototype.tryUnsubscribe = function () { this.unsubscribe && (this.unsubscribe(), this.unsubscribe = null) }, a.prototype.componentDidMount = function () { this.trySubscribe() }, a.prototype.componentWillReceiveProps = function (t) { g && (0, P["default"])(t, this.props) || (this.haveOwnPropsChanged = !0) }, a.prototype.componentWillUnmount = function () { this.tryUnsubscribe(), this.clearCache() }, a.prototype.clearCache = function () { this.dispatchProps = null, this.stateProps = null, this.mergedProps = null, this.haveOwnPropsChanged = !0, this.hasStoreStateChanged = !0, this.haveStatePropsBeenPrecalculated = !1, this.statePropsPrecalculationError = null, this.renderedElement = null, this.finalMapDispatchToProps = null, this.finalMapStateToProps = null }, a.prototype.handleChange = function () { if (this.unsubscribe) { var t = this.store.getState(), e = this.state.storeState; if (!g || e !== t) { if (g && !this.doStatePropsDependOnOwnProps) { var r = p(this.updateStatePropsIfNeeded, this); if (!r) return; r === T && (this.statePropsPrecalculationError = T.value), this.haveStatePropsBeenPrecalculated = !0 } this.hasStoreStateChanged = !0, this.setState({ storeState: t }) } } }, a.prototype.getWrappedInstance = function () { return (0, w["default"])(O, "To access the wrapped instance, you need to specify { withRef: true } as the fourth argument of the connect() call."), this.refs.wrappedInstance }, a.prototype.render = function () { var e = this.haveOwnPropsChanged, r = this.hasStoreStateChanged, o = this.haveStatePropsBeenPrecalculated, n = this.statePropsPrecalculationError, s = this.renderedElement; if (this.haveOwnPropsChanged = !1, this.hasStoreStateChanged = !1, this.haveStatePropsBeenPrecalculated = !1, this.statePropsPrecalculationError = null, n) throw n; var i = !0, a = !0; g && s && (i = r || e && this.doStatePropsDependOnOwnProps, a = e && this.doDispatchPropsDependOnOwnProps); var p = !1, u = !1; o ? p = !0 : i && (p = this.updateStatePropsIfNeeded()), a && (u = this.updateDispatchPropsIfNeeded()); var h = !0; return h = p || u || e ? this.updateMergedPropsIfNeeded() : !1, !h && s ? s : this.renderedElement = O ? (0, f.createElement)(t, c({}, this.mergedProps, { ref: "wrappedInstance" })) : (0, f.createElement)(t, this.mergedProps) }, a }(f.Component); return o.displayName = r, o.WrappedComponent = t, o.contextTypes = { store: l["default"] }, o.propTypes = { store: l["default"] }, (0, S["default"])(o, t) } } var c = Object.assign || function (t) { for (var e = 1; e < arguments.length; e++) { var r = arguments[e]; for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (t[o] = r[o]) } return t }; e.__esModule = !0, e["default"] = u; var f = r(1), h = r(2), l = o(h), d = r(6), P = o(d), y = r(7), v = o(y), b = r(3), g = (o(b), r(12)), m = (o(g), r(8)), S = o(m), O = r(9), w = o(O), x = function (t) { return {} }, C = function (t) { return { dispatch: t } }, M = function (t, e, r) { return c({}, r, t, e) }, T = { value: null }, _ = 0 }, function (t, e) { "use strict"; function r(t, e) { if (t === e) return !0; var r = Object.keys(t), o = Object.keys(e); if (r.length !== o.length) return !1; for (var n = Object.prototype.hasOwnProperty, s = 0; r.length > s; s++) if (!n.call(e, r[s]) || t[r[s]] !== e[r[s]]) return !1; return !0 } e.__esModule = !0, e["default"] = r }, function (t, e, r) { "use strict"; function o(t) { return function (e) { return (0, n.bindActionCreators)(t, e) } } e.__esModule = !0, e["default"] = o; var n = r(13) }, function (t, e) { "use strict"; var r = { childContextTypes: !0, contextTypes: !0, defaultProps: !0, displayName: !0, getDefaultProps: !0, mixins: !0, propTypes: !0, type: !0 }, o = { name: !0, length: !0, prototype: !0, caller: !0, arguments: !0, arity: !0 }; t.exports = function (t, e) { for (var n = Object.getOwnPropertyNames(e), s = 0; n.length > s; ++s) r[n[s]] || o[n[s]] || (t[n[s]] = e[n[s]]); return t } }, function (t, e, r) { "use strict"; var o = function (t, e, r, o, n, s, i, a) { if (!t) { var p; if (void 0 === e) p = Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."); else { var u = [r, o, n, s, i, a], c = 0; p = Error(e.replace(/%s/g, function () { return u[c++] })), p.name = "Invariant Violation" } throw p.framesToPop = 1, p } }; t.exports = o }, function (t, e) { function r(t) { var e = !1; if (null != t && "function" != typeof t.toString) try { e = !!(t + "") } catch (r) { } return e } t.exports = r }, function (t, e) { function r(t) { return !!t && "object" == typeof t } t.exports = r }, function (t, e, r) { function o(t) { if (!s(t) || c.call(t) != i || n(t)) return !1; var e = a; if ("function" == typeof t.constructor && (e = f(t)), null === e) return !0; var r = e.constructor; return "function" == typeof r && r instanceof r && p.call(r) == u } var n = r(10), s = r(11), i = "[object Object]", a = Object.prototype, p = Function.prototype.toString, u = p.call(Object), c = a.toString, f = Object.getPrototypeOf; t.exports = o }, function (t, r) { t.exports = e }]) });