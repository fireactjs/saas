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
import React, { useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { getAuth } from "firebase/auth";
import { Alert, Box, Container, Grid, Paper, Typography, Button, Stack, Card, CardHeader, CardActions, Chip } from "@mui/material";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { httpsCallable } from "firebase/functions";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
export const ManagePaymentMethods = _ref => {
  let {
    loader
  } = _ref;
  const {
    subscription,
    setSubscription
  } = useContext(SubscriptionContext);
  const subscriptionName = subscription.name;
  const [loaded, setLoeaded] = useState(false);
  const {
    firestoreInstance,
    functionsInstance
  } = useContext(AuthContext);
  const auth = getAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [error, setError] = useState(null);
  const [paymentFormDisabled, setPaymentFormDisabled] = useState(false);
  const [paymentMethodFormShowed, setPaymentMethodFormShowed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const {
    config
  } = useContext(FireactContext);
  const navigate = useNavigate();
  useEffect(() => {
    setLoeaded(false);
    setError(null);
    setPaymentMethodFormShowed(false);
    // load payment methods of the user
    const paymentMethodsRef = collection(firestoreInstance, 'users/' + auth.currentUser.uid + '/paymentMethods');
    getDocs(paymentMethodsRef).then(paymentMethodsSnapshot => {
      const paymentMethods = [];
      paymentMethodsSnapshot.forEach(paymentMethod => {
        paymentMethods.push({
          id: paymentMethod.id,
          type: paymentMethod.data().type,
          cardBrand: paymentMethod.data().cardBrand,
          cardExpMonth: paymentMethod.data().cardExpMonth,
          cardExpYear: paymentMethod.data().cardExpYear,
          cardLast4: paymentMethod.data().cardLast4
        });
      });
      if (paymentMethods.length === 0) {
        setPaymentMethodFormShowed(true);
      }
      setPaymentMethods(paymentMethods);
      setLoeaded(true);
    }).catch(err => {
      setError(err.message);
      setLoeaded(true);
    });
  }, [auth.currentUser.uid, firestoreInstance]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, loaded ? /*#__PURE__*/React.createElement(Container, {
    maxWidth: "lx"
  }, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: "Payment Methods" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h4"
  }, "Payment Methods")), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    textAlign: "right"
  }, /*#__PURE__*/React.createElement(Stack, {
    direction: "row-reverse",
    spacing: 1,
    mt: 2
  }, !paymentMethodFormShowed && /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "small",
    onClick: () => setPaymentMethodFormShowed(true)
  }, "Add Payment Method"), paymentMethodFormShowed && paymentMethods.length > 0 && /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "small",
    onClick: () => setPaymentMethodFormShowed(false)
  }, "Payment Methods"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))
  }, "Invoice List"))))), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, error !== null ? /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error) : /*#__PURE__*/React.createElement(React.Fragment, null, paymentMethodFormShowed ? /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Box, {
    p: 5
  }, /*#__PURE__*/React.createElement(Stack, {
    spacing: 3
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h5",
    align: "center",
    color: "text.primary",
    gutterBottom: true,
    mb: 8
  }, "Add Payment Method")), /*#__PURE__*/React.createElement(PaymentMethodForm, {
    setPaymentMethod: pm => {
      setError(null);
      setPaymentFormDisabled(true);
      // write payment method to user
      const pmRef = doc(firestoreInstance, 'users/' + auth.currentUser.uid + '/paymentMethods/' + pm.id);
      setDoc(pmRef, {
        type: pm.type,
        cardBrand: pm.card.brand,
        cardExpMonth: pm.card.exp_month,
        cardExpYear: pm.card.exp_year,
        cardLast4: pm.card.last4
      }, {
        merge: true
      }).then(() => {
        // attach the payment method to a subscription via cloud function
        const updateSubscriptionPaymentMethod = httpsCallable(functionsInstance, 'fireactjsSaas-updateSubscriptionPaymentMethod');
        return updateSubscriptionPaymentMethod({
          subscriptionId: subscription.id,
          paymentMethodId: pm.id
        });
      }).then(() => {
        // update subscription default payment
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          paymentMethod: pm.id
        }));
        // add payment method to state
        setPaymentMethods(prevState => {
          prevState.push({
            id: pm.id,
            type: pm.type,
            cardBrand: pm.card.brand,
            cardExpMonth: pm.card.exp_month,
            cardExpYear: pm.card.exp_year,
            cardLast4: pm.card.last4
          });
          return prevState;
        });
        setPaymentFormDisabled(false);
        setPaymentMethodFormShowed(false);
      }).catch(err => {
        setPaymentFormDisabled(false);
        setError(err.message);
      });
    },
    buttonText: "Add Payment Method",
    disabled: paymentFormDisabled
  }))) : /*#__PURE__*/React.createElement(Grid, {
    container: true,
    spacing: 3
  }, paymentMethods.map((paymentMethod, i) => /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12,
    md: 4,
    key: i
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: /*#__PURE__*/React.createElement(Stack, {
      direction: "row",
      spacing: 2,
      alignItems: "center"
    }, /*#__PURE__*/React.createElement(Typography, {
      component: "h3",
      variant: "h4"
    }, paymentMethod.cardBrand), subscription.paymentMethod === paymentMethod.id && /*#__PURE__*/React.createElement(Chip, {
      label: "active",
      color: "success",
      size: "small"
    })),
    subheader: /*#__PURE__*/React.createElement(Grid, {
      container: true
    }, /*#__PURE__*/React.createElement(Grid, {
      item: true,
      xs: true
    }, "**** **** **** ", paymentMethod.cardLast4), /*#__PURE__*/React.createElement(Grid, {
      item: true
    }, paymentMethod.cardExpMonth, " / ", paymentMethod.cardExpYear))
  }), /*#__PURE__*/React.createElement(CardActions, null, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    color: "success",
    disabled: subscription.paymentMethod === paymentMethod.id || processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      const updateSubscriptionPaymentMethod = httpsCallable(functionsInstance, 'fireactjsSaas-updateSubscriptionPaymentMethod');
      return updateSubscriptionPaymentMethod({
        subscriptionId: subscription.id,
        paymentMethodId: paymentMethod.id
      }).then(() => {
        // update subscription default payment
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          paymentMethod: paymentMethod.id
        }));
        setProcessing(false);
      }).catch(err => {
        setError(err.message);
        setProcessing(false);
      });
    }
  }, "Set Default"), /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    color: "error",
    disabled: subscription.paymentMethod === paymentMethod.id || processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      const removePaymentMethod = httpsCallable(functionsInstance, 'fireactjsSaas-removePaymentMethod');
      return removePaymentMethod({
        paymentMethodId: paymentMethod.id
      }).then(() => {
        setPaymentMethods(prevState => prevState.filter(row => {
          return row.id !== paymentMethod.id;
        }));
        setProcessing(false);
      }).catch(err => {
        setError(err.message);
        setProcessing(false);
      });
    }
  }, "Remove")))))))))) : /*#__PURE__*/React.createElement(React.Fragment, null, loader));
};