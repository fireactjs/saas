function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.replace.js";
import "core-js/modules/es.symbol.description.js";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Alert, Box, Container, Paper, Stack, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { PricingPlans } from "./PricingPlans";
import { SubscriptionContext } from "./SubscriptionContext";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { httpsCallable } from "firebase/functions";
import { NavLink } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { BillingDetails } from "./BillingDetails";
export const ChangePlan = () => {
  const {
    subscription,
    setSubscription
  } = useContext(SubscriptionContext);
  const {
    config
  } = useContext(FireactContext);
  const {
    firestoreInstance,
    functionsInstance,
    authInstance
  } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [success, setSuccess] = useState(false);
  const [billingDetails, setBillingDetails] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1);
  const selectPlan = plan => {
    setProcessing(true);
    setError(null);
    if (plan.free || subscription.paymentMethod) {
      // subscribe to the new plan
      const changeSubscriptionPlan = httpsCallable(functionsInstance, 'fireactjsSaas-changeSubscriptionPlan');
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
    const changeSubscriptionPlan = httpsCallable(functionsInstance, 'fireactjsSaas-changeSubscriptionPlan');
    changeSubscriptionPlan({
      paymentMethodId: paymentMethod.id,
      billingDetails: billingDetails,
      planId: selectedPlan.id,
      subscriptionId: subscription.id
    }).then(() => {
      const pmRef = doc(firestoreInstance, 'users/' + authInstance.currentUser.uid + '/paymentMethods/' + paymentMethod.id);
      return setDoc(pmRef, {
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
  return /*#__PURE__*/React.createElement(Container, {
    maxWidth: "lg"
  }, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: "Change Plan" + (subscription.name !== "" && typeof subscription.name !== 'undefined' ? " - " + subscription.name : "")
  }), success ? /*#__PURE__*/React.createElement(Alert, {
    severity: "success"
  }, "Your subscription plan has been changed. Please go back to ", /*#__PURE__*/React.createElement(NavLink, {
    to: config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id)
  }, "Billing"), ".") : /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
    p: 5
  }, showPaymentMethod ? /*#__PURE__*/React.createElement(Stack, {
    spacing: 3
  }, paymentStep === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true
  }, "Your Billing Details"), error !== null && /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error), /*#__PURE__*/React.createElement(BillingDetails, {
    buttonText: "Continue",
    setBillingDetailsObject: obj => {
      setBillingDetails(obj);
      setPaymentStep(2);
    }
  })), paymentStep === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true
  }, "Setup Payment Method"), error !== null && /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error), /*#__PURE__*/React.createElement(PaymentMethodForm, {
    buttonText: "Subscribe",
    setPaymentMethod: submitPlan,
    disabled: processing
  }))) : /*#__PURE__*/React.createElement(Stack, {
    spacing: 3
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true
  }, "Choose a Plan"), error !== null && /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PricingPlans, {
    selectedPlanId: subscription.planId,
    selectPlan: selectPlan,
    disabled: processing,
    paymentMethod: subscription.paymentMethod
  }))))));
};