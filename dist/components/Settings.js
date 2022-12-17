"use strict";

require("core-js/modules/es.symbol.description.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Settings = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.string.trim.js");
var _react = _interopRequireWildcard(require("react"));
var _SubscriptionContext = require("./SubscriptionContext");
var _material = require("@mui/material");
var _core = require("@fireactjs/core");
var _firestore = require("firebase/firestore");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const Settings = () => {
  const {
    subscription,
    setSubscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const defaultName = subscription.name ? subscription.name : "";
  const [error, setError] = (0, _react.useState)(null);
  const [success, setSuccess] = (0, _react.useState)(null);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const label = config.saas.subscription.singular.substr(0, 1).toUpperCase() + config.saas.subscription.singular.substr(1);
  const {
    firebaseApp
  } = (0, _react.useContext)(_core.AuthContext);
  const [subscriptionName, setSubscriptionName] = (0, _react.useState)(defaultName);
  const updateSubscription = () => {
    setProcessing(true);
    setError(null);
    setSuccess(null);
    const db = (0, _firestore.getFirestore)(firebaseApp);
    const docRef = (0, _firestore.doc)(db, "subscriptions", subscription.id);
    if (subscriptionName.trim() !== "") {
      (0, _firestore.setDoc)(docRef, {
        name: subscriptionName
      }, {
        merge: true
      }).then(() => {
        setSuccess('The settings have been successfully updated.');
        setProcessing(false);
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          name: subscriptionName
        }));
      }).catch(error => {
        setError(error.message);
        setProcessing(false);
      });
    } else {
      setError(label + " is a required field.");
      setProcessing(false);
    }
  };
  return /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "md"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Settings" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Settings")), error !== null && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)), success !== null && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "success"
  }, success)), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    required: true,
    fullWidth: true,
    name: "title",
    label: label,
    type: "text",
    margin: "normal",
    defaultValue: subscription.name,
    onChange: e => setSubscriptionName(e.target.value)
  })), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: true
  }), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    color: "primary",
    variant: "contained",
    disabled: processing,
    onClick: () => updateSubscription()
  }, "Save"))))));
};
exports.Settings = Settings;