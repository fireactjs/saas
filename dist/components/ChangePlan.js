"use strict";

require("core-js/modules/es.symbol.description.js");
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
require("firebase/compat/functions");
var _PaymentMethodForm = require("./PaymentMethodForm");
var _reactRouterDom = require("react-router-dom");
var _auth = require("firebase/auth");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const ChangePlan = () => {
  const {
    subscription,
    setSubscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const auth = (0, _auth.getAuth)();
  const {
    firebaseApp
  } = (0, _react.useContext)(_core.AuthContext);
  const CloudFunctions = firebaseApp.functions();
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const [showPaymentMethod, setShowPaymentMethod] = (0, _react.useState)(false);
  const [selectedPlan, setSelectedPlan] = (0, _react.useState)(null);
  const [success, setSuccess] = (0, _react.useState)(false);
  const selectPlan = plan => {
    setProcessing(true);
    setError(null);
    if (plan.price === 0 || subscription.paymentMethod) {
      // subscribe to the new plan
      const changeSubscriptionPlan = CloudFunctions.httpsCallable('fireactjsSaas-changeSubscriptionPlan');
      changeSubscriptionPlan({
        paymentMethodId: subscription.paymentMethod,
        priceId: plan.priceId,
        subscriptionId: subscription.id
      }).then(() => {
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          plan: plan.title,
          // title of the plan
          stripePriceId: plan.priceId,
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
    const changeSubscriptionPlan = CloudFunctions.httpsCallable('fireactjsSaas-changeSubscriptionPlan');
    changeSubscriptionPlan({
      paymentMethodId: paymentMethod.id,
      priceId: selectedPlan.priceId,
      subscriptionId: subscription.id
    }).then(() => {
      const pmRef = firebaseApp.firestore().doc('users/' + auth.currentUser.uid + '/paymentMethods/' + paymentMethod.id);
      return pmRef.set({
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
        stripePriceId: selectedPlan.priceId,
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
    title: "Change Plan" + (subscription.name !== "" ? " - " + subscription.name : "")
  }), success ? /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "success"
  }, "Your subscription plan has been changed. Please go back to ", /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id)
  }, "Billing"), ".") : /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 5
  }, showPaymentMethod ? /*#__PURE__*/_react.default.createElement(_material.Stack, {
    spacing: 3
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true
  }, "Setup Payment Method"), error !== null && /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error), /*#__PURE__*/_react.default.createElement(_PaymentMethodForm.PaymentMethodForm, {
    buttonText: "Submit",
    setPaymentMethod: submitPlan,
    disabled: processing
  })) : /*#__PURE__*/_react.default.createElement(_material.Stack, {
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
    selectedPriceId: subscription.stripePriceId,
    selectPlan: selectPlan,
    disabled: processing,
    paymentMethod: subscription.paymentMethod
  }))))));
};
exports.ChangePlan = ChangePlan;