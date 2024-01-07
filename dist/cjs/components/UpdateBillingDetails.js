"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateBillingDetails = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _auth = require("firebase/auth");
var _firestore = require("firebase/firestore");
var _react = _interopRequireWildcard(require("react"));
var _BillingDetails = require("./BillingDetails");
var _SubscriptionContext = require("./SubscriptionContext");
var _reactRouterDom = require("react-router-dom");
var _functions = require("firebase/functions");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const UpdateBillingDetails = _ref => {
  let {
    loader
  } = _ref;
  const title = "Update Billing Details";
  const {
    subscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const [loaded, setLoeaded] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const auth = (0, _auth.getAuth)();
  const {
    firestoreInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const navigate = (0, _reactRouterDom.useNavigate)();
  const [billingDetails, setBillingDetails] = (0, _react.useState)(null);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [succss, setSuccess] = (0, _react.useState)(false);
  const {
    functionsInstance
  } = (0, _react.useContext)(_core.AuthContext);
  (0, _react.useEffect)(() => {
    setLoeaded(false);
    setError(null);
    (0, _firestore.getDoc)((0, _firestore.doc)(firestoreInstance, 'users/' + auth.currentUser.uid)).then(doc => {
      setBillingDetails(doc.data().billingDetails);
      setLoeaded(true);
    }).catch(err => {
      setError(err.message);
      setLoeaded(true);
    });
  }, [auth.currentUser.uid, firestoreInstance]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loaded ? /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "lx"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: title
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h4"
  }, title)), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    textAlign: "right"
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))
  }, "Invoice List")))), error !== null ? /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, succss === true && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "success"
  }, "Billing details have been updated successfully.")), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_BillingDetails.BillingDetails, {
    disabled: processing,
    buttonText: "Update",
    currentBillingDetails: billingDetails,
    setBillingDetailsObject: obj => {
      setProcessing(true);
      setSuccess(false);
      const changeBillingDetails = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-changeBillingDetails');
      changeBillingDetails({
        billingDetails: obj
      }).then(() => {
        setBillingDetails(obj);
        setProcessing(false);
        setSuccess(true);
      }).catch(error => {
        setError(error.message);
        setProcessing(false);
        setSuccess(false);
      });
    }
  }))))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loader));
};
exports.UpdateBillingDetails = UpdateBillingDetails;