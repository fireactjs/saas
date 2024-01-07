"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateSubscription = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _react = _interopRequireWildcard(require("react"));
var _PricingPlans = require("./PricingPlans");
var _functions = require("firebase/functions");
var _PaymentMethodForm = require("./PaymentMethodForm");
var _reactRouterDom = require("react-router-dom");
var _auth = require("firebase/auth");
var _firestore = require("firebase/firestore");
var _BillingDetails = require("./BillingDetails");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const CreateSubscription = () => {
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const {
    firestoreInstance,
    functionsInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const [showPaymentMethod, setShowPaymentMethod] = (0, _react.useState)(false);
  const [paymentStep, setPaymentStep] = (0, _react.useState)(1);
  const [billingDetails, setBillingDetails] = (0, _react.useState)(null);
  const [selectedPlan, setSelectedPlan] = (0, _react.useState)(null);
  const singular = config.saas.subscription.singular;
  const auth = (0, _auth.getAuth)();
  const navigate = (0, _reactRouterDom.useNavigate)();
  const selectPlan = plan => {
    setProcessing(true);
    setError(null);
    if (plan.free) {
      // subscribe to free plans on selection
      const createSubscription = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-createSubscription');
      createSubscription({
        planId: plan.id,
        paymentMethodId: null,
        BillingDetails: null
      }).then(res => {
        if (res.data && res.data.subscriptionId) {
          navigate(config.pathnames.Settings.replace(":subscriptionId", res.data.subscriptionId));
        } else {
          setError("Failed to create the " + singular + ".");
          setProcessing(false);
        }
      }).catch(error => {
        setError(error.message);
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
    const createSubscription = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-createSubscription');
    let subscriptionId = null;
    createSubscription({
      paymentMethodId: paymentMethod.id,
      planId: selectedPlan.id,
      billingDetails: billingDetails
    }).then(res => {
      if (res.data && res.data.subscriptionId) {
        subscriptionId = res.data.subscriptionId;
      }
      const pmRef = (0, _firestore.doc)(firestoreInstance, 'users/' + auth.currentUser.uid + '/paymentMethods/' + paymentMethod.id);
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
      if (subscriptionId !== null) {
        navigate(config.pathnames.Settings.replace(":subscriptionId", subscriptionId));
      } else {
        setError("Failed to create the " + singular + ".");
        setProcessing(false);
      }
    }).catch(err => {
      setError(err.message);
      setProcessing(false);
    });
  };
  return /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "lg"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Choose a Plan"
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
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
    selectPlan: selectPlan,
    disabled: processing
  }))))));
};
exports.CreateSubscription = CreateSubscription;