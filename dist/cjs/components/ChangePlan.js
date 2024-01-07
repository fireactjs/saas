"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChangePlan = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _react = _interopRequireWildcard(require("react"));
var _PricingPlans = require("./PricingPlans");
var _SubscriptionContext = require("./SubscriptionContext");
var _PaymentMethodForm = require("./PaymentMethodForm");
var _functions = require("firebase/functions");
var _reactRouterDom = require("react-router-dom");
var _firestore = require("firebase/firestore");
var _BillingDetails = require("./BillingDetails");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const ChangePlan = () => {
  const {
    subscription,
    setSubscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const {
    firestoreInstance,
    functionsInstance,
    authInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const [showPaymentMethod, setShowPaymentMethod] = (0, _react.useState)(false);
  const [selectedPlan, setSelectedPlan] = (0, _react.useState)(null);
  const [success, setSuccess] = (0, _react.useState)(false);
  const [billingDetails, setBillingDetails] = (0, _react.useState)(null);
  const [paymentStep, setPaymentStep] = (0, _react.useState)(1);
  const selectPlan = plan => {
    setProcessing(true);
    setError(null);
    if (plan.free || subscription.paymentMethod) {
      // subscribe to the new plan
      const changeSubscriptionPlan = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-changeSubscriptionPlan');
      changeSubscriptionPlan({
        paymentMethodId: subscription.paymentMethod,
        billingDetails: null,
        planId: plan.id,
        subscriptionId: subscription.id
      }).then(() => {
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          plan: plan.title,
          // title of the plan
          planId: plan.id,
          // price ID in stripe
          paymentCycle: plan.frequency,
          price: plan.price,
          currency: plan.currency
        }));
        setSuccess(true);
        setProcessing(false);
      }).catch(err => {
        setError(err.message);
        setProcessing(false);
      });
    } else {
      // show payment method
      setSelectedPlan(plan);
      setShowPaymentMethod(true);
      setProcessing(false);
    }
  };
  const submitPlan = paymentMethod => {
    setProcessing(true);
    setError(null);
    const changeSubscriptionPlan = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-changeSubscriptionPlan');
    changeSubscriptionPlan({
      paymentMethodId: paymentMethod.id,
      billingDetails: billingDetails,
      planId: selectedPlan.id,
      subscriptionId: subscription.id
    }).then(() => {
      const pmRef = (0, _firestore.doc)(firestoreInstance, 'users/' + authInstance.currentUser.uid + '/paymentMethods/' + paymentMethod.id);
      return (0, _firestore.setDoc)(pmRef, {
        type: paymentMethod.type,
        cardBrand: paymentMethod.card.brand,
        cardExpMonth: paymentMethod.card.exp_month,
        cardExpYear: paymentMethod.card.exp_year,
        cardLast4: paymentMethod.card.last4
      }, {
        merge: true
      });
    }).then(() => {
      setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
        plan: selectedPlan.title,
        // title of the plan
        planId: selectedPlan.id,
        // price ID in stripe
        paymentCycle: selectedPlan.frequency,
        price: selectedPlan.price,
        currency: selectedPlan.currency,
        paymentMethod: paymentMethod.id
      }));
      setSuccess(true);
      setProcessing(false);
    }).catch(err => {
      setError(err.message);
      setProcessing(false);
    });
  };
  return /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "lg"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Change Plan" + (subscription.name !== "" && typeof subscription.name !== 'undefined' ? " - " + subscription.name : "")
  }), success ? /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "success"
  }, "Your subscription plan has been changed. Please go back to ", /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id)
  }, "Billing"), ".") : /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 5
  }, showPaymentMethod ? /*#__PURE__*/_react.default.createElement(_material.Stack, {
    spacing: 3
  }, paymentStep === 1 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true
  }, "Your Billing Details"), error !== null && /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error), /*#__PURE__*/_react.default.createElement(_BillingDetails.BillingDetails, {
    buttonText: "Continue",
    setBillingDetailsObject: obj => {
      setBillingDetails(obj);
      setPaymentStep(2);
    }
  })), paymentStep === 2 && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true
  }, "Setup Payment Method"), error !== null && /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error), /*#__PURE__*/_react.default.createElement(_PaymentMethodForm.PaymentMethodForm, {
    buttonText: "Subscribe",
    setPaymentMethod: submitPlan,
    disabled: processing
  }))) : /*#__PURE__*/_react.default.createElement(_material.Stack, {
    spacing: 3
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true
  }, "Choose a Plan"), error !== null && /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_PricingPlans.PricingPlans, {
    selectedPlanId: subscription.planId,
    selectPlan: selectPlan,
    disabled: processing,
    paymentMethod: subscription.paymentMethod
  }))))));
};
exports.ChangePlan = ChangePlan;