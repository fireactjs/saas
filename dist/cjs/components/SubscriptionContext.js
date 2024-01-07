"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubscriptionProvider = exports.SubscriptionContext = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _firestore = require("firebase/firestore");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const SubscriptionContext = exports.SubscriptionContext = /*#__PURE__*/_react.default.createContext();
const SubscriptionProvider = _ref => {
  let {
    loader
  } = _ref;
  const {
    subscriptionId
  } = (0, _reactRouterDom.useParams)();
  const [subscription, setSubscription] = (0, _react.useState)(null);
  const {
    firestoreInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const [error, setError] = (0, _react.useState)(null);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  (0, _react.useEffect)(() => {
    setError(null);
    const docRef = (0, _firestore.doc)(firestoreInstance, "subscriptions", subscriptionId);
    (0, _firestore.getDoc)(docRef).then(docSnap => {
      if (docSnap.exists()) {
        const sub = docSnap.data();
        sub.id = subscriptionId;
        setSubscription(sub);
      } else {
        // no subscription
        setError("No " + config.saas.subscription.singular + " matches the ID");
      }
    }).catch(error => {
      setError(error.message);
    });
  }, [subscriptionId, firestoreInstance, config.saas.subscription.singular, setError]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, error !== null ? /*#__PURE__*/_react.default.createElement(_material.Box, {
    mt: 10
  }, /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "sm"
  }, /*#__PURE__*/_react.default.createElement(_material.Box, {
    component: "span",
    m: 5,
    textAlign: "center"
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, subscription !== null ? /*#__PURE__*/_react.default.createElement(SubscriptionContext.Provider, {
    value: {
      subscription,
      setSubscription
    }
  }, /*#__PURE__*/_react.default.createElement(_reactRouterDom.Outlet, null)) : /*#__PURE__*/_react.default.createElement(_material.Box, {
    mt: 10
  }, /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "sm"
  }, /*#__PURE__*/_react.default.createElement(_material.Box, {
    component: "span",
    m: 5,
    textAlign: "center"
  }, loader)))));
};
exports.SubscriptionProvider = SubscriptionProvider;