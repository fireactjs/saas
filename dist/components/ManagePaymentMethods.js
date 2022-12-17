"use strict";

require("core-js/modules/es.symbol.description.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagePaymentMethods = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _core = require("@fireactjs/core");
var _react = _interopRequireWildcard(require("react"));
var _SubscriptionContext = require("./SubscriptionContext");
var _auth = require("firebase/auth");
var _material = require("@mui/material");
var _PaymentMethodForm = require("./PaymentMethodForm");
require("firebase/compat/functions");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const ManagePaymentMethods = _ref => {
  let {
    loader
  } = _ref;
  const {
    subscription,
    setSubscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const subscriptionName = subscription.name;
  const [loaded, setLoeaded] = (0, _react.useState)(false);
  const {
    firebaseApp
  } = (0, _react.useContext)(_core.AuthContext);
  const auth = (0, _auth.getAuth)();
  const [paymentMethods, setPaymentMethods] = (0, _react.useState)([]);
  const [error, setError] = (0, _react.useState)(null);
  const [paymentFormDisabled, setPaymentFormDisabled] = (0, _react.useState)(false);
  const [paymentMethodFormShowed, setPaymentMethodFormShowed] = (0, _react.useState)(false);
  const CloudFunctions = firebaseApp.functions();
  const [processing, setProcessing] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    setLoeaded(false);
    setError(null);
    setPaymentMethodFormShowed(false);
    // load payment methods of the user
    const paymentMethodsRef = firebaseApp.firestore().collection('users/' + auth.currentUser.uid + '/paymentMethods');
    paymentMethodsRef.get().then(paymentMethodsSnapshot => {
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
  }, [auth.currentUser.uid, firebaseApp]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loaded ? /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "lx"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Payment Methods" + (subscriptionName !== "" ? " - " + subscriptionName : "")
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
  }, "Payment Methods")), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    textAlign: "right"
  }, !paymentMethodFormShowed && /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "contained",
    onClick: () => setPaymentMethodFormShowed(true)
  }, "Add Payment Method"), paymentMethodFormShowed && paymentMethods.length > 0 && /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "contained",
    onClick: () => setPaymentMethodFormShowed(false)
  }, "Back to Payment Methods")))), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, error !== null ? /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, paymentMethodFormShowed ? /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 5
  }, /*#__PURE__*/_react.default.createElement(_material.Stack, {
    spacing: 3
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h5",
    align: "center",
    color: "text.primary",
    gutterBottom: true,
    mb: 8
  }, "Add Payment Method")), /*#__PURE__*/_react.default.createElement(_PaymentMethodForm.PaymentMethodForm, {
    setPaymentMethod: pm => {
      setError(null);
      setPaymentFormDisabled(true);
      // write payment method to user
      const pmRef = firebaseApp.firestore().doc('users/' + auth.currentUser.uid + '/paymentMethods/' + pm.id);
      pmRef.set({
        type: pm.type,
        cardBrand: pm.card.brand,
        cardExpMonth: pm.card.exp_month,
        cardExpYear: pm.card.exp_year,
        cardLast4: pm.card.last4
      }, {
        merge: true
      }).then(() => {
        // attach the payment method to a subscription via cloud function
        const updateSubscriptionPaymentMethod = CloudFunctions.httpsCallable('fireactjsSaas-updateSubscriptionPaymentMethod');
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
  }))) : /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    spacing: 3
  }, paymentMethods.map((paymentMethod, i) => /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 12,
    md: 4,
    key: i
  }, /*#__PURE__*/_react.default.createElement(_material.Card, null, /*#__PURE__*/_react.default.createElement(_material.CardHeader, {
    title: /*#__PURE__*/_react.default.createElement(_material.Stack, {
      direction: "row",
      spacing: 2,
      alignItems: "center"
    }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
      component: "h3",
      variant: "h4"
    }, paymentMethod.cardBrand), subscription.paymentMethod === paymentMethod.id && /*#__PURE__*/_react.default.createElement(_material.Chip, {
      label: "active",
      color: "success",
      size: "small"
    })),
    subheader: /*#__PURE__*/_react.default.createElement(_material.Grid, {
      container: true
    }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true,
      xs: true
    }, "**** **** **** ", paymentMethod.cardLast4), /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true
    }, paymentMethod.cardExpMonth, " / ", paymentMethod.cardExpYear))
  }), /*#__PURE__*/_react.default.createElement(_material.CardActions, null, /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    color: "success",
    disabled: subscription.paymentMethod === paymentMethod.id || processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      const updateSubscriptionPaymentMethod = CloudFunctions.httpsCallable('fireactjsSaas-updateSubscriptionPaymentMethod');
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
  }, "Set Default"), /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    color: "error",
    disabled: subscription.paymentMethod === paymentMethod.id || processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      const removePaymentMethod = CloudFunctions.httpsCallable('fireactjsSaas-removePaymentMethod');
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
  }, "Remove")))))))))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loader));
};
exports.ManagePaymentMethods = ManagePaymentMethods;