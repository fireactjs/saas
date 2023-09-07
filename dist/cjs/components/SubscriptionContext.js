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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const SubscriptionContext = /*#__PURE__*/_react.default.createContext();
exports.SubscriptionContext = SubscriptionContext;
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
        console.log(sub);
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