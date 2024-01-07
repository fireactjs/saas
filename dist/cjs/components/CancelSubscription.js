"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CancelSubscription = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _react = _interopRequireWildcard(require("react"));
var _SubscriptionContext = require("./SubscriptionContext");
var _reactRouterDom = require("react-router-dom");
var _functions = require("firebase/functions");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const CancelSubscription = () => {
  const {
    subscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [input, setInput] = (0, _react.useState)("");
  const navigate = (0, _reactRouterDom.useNavigate)();
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const [error, setError] = (0, _react.useState)(null);
  const {
    functionsInstance
  } = (0, _react.useContext)(_core.AuthContext);
  return /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "md"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Cancel Subscription" + (subscription.name !== "" ? " - " + subscription.name : "")
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Cancel Subscription")), error !== null && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "p",
    align: "center",
    size: "small"
  }, "Type in ", /*#__PURE__*/_react.default.createElement("strong", null, subscription.id), " and click the \"Cancel Subscription\" button to confirm the cancellation. This action cannot be undone."), /*#__PURE__*/_react.default.createElement(_material.TextField, {
    required: true,
    fullWidth: true,
    name: "title",
    type: "text",
    margin: "normal",
    onChange: e => setInput(e.target.value)
  })), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: true
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    color: "secondary",
    variant: "outlined",
    disabled: processing,
    onClick: () => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))
  }, "Back")), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    color: "error",
    variant: "contained",
    disabled: processing,
    onClick: () => {
      setError(null);
      setProcessing(true);
      if (input !== subscription.id) {
        setError("The input confirmation does not match \"" + subscription.id + "\"");
        setProcessing(false);
      } else {
        const cancelSubscription = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-cancelSubscription');
        return cancelSubscription({
          subscriptionId: subscription.id
        }).then(() => {
          // redirect
          navigate(config.pathnames.ListSubscriptions);
        }).catch(error => {
          setError(error.message);
          setProcessing(false);
        });
      }
    }
  }, "Cancel Subscription"))))));
};
exports.CancelSubscription = CancelSubscription;