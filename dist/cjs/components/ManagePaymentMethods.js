"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManagePaymentMethods = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _core = require("@fireactjs/core");
var _react = _interopRequireWildcard(require("react"));
var _SubscriptionContext = require("./SubscriptionContext");
var _auth = require("firebase/auth");
var _material = require("@mui/material");
var _PaymentMethodForm = require("./PaymentMethodForm");
var _functions = require("firebase/functions");
var _firestore = require("firebase/firestore");
var _reactRouterDom = require("react-router-dom");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
    firestoreInstance,
    functionsInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const auth = (0, _auth.getAuth)();
  const [paymentMethods, setPaymentMethods] = (0, _react.useState)([]);
  const [error, setError] = (0, _react.useState)(null);
  const [paymentFormDisabled, setPaymentFormDisabled] = (0, _react.useState)(false);
  const [paymentMethodFormShowed, setPaymentMethodFormShowed] = (0, _react.useState)(false);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const navigate = (0, _reactRouterDom.useNavigate)();
  (0, _react.useEffect)(() => {
    setLoeaded(false);
    setError(null);
    setPaymentMethodFormShowed(false);
    // load payment methods of the user
    const paymentMethodsRef = (0, _firestore.collection)(firestoreInstance, 'users/' + auth.currentUser.uid + '/paymentMethods');
    (0, _firestore.getDocs)(paymentMethodsRef).then(paymentMethodsSnapshot => {
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
  }, /*#__PURE__*/_react.default.createElement(_material.Stack, {
    direction: "row-reverse",
    spacing: 1,
    mt: 2
  }, !paymentMethodFormShowed && /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    size: "small",
    onClick: () => setPaymentMethodFormShowed(true)
  }, "Add Payment Method"), paymentMethodFormShowed && paymentMethods.length > 0 && /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    size: "small",
    onClick: () => setPaymentMethodFormShowed(false)
  }, "Payment Methods"), /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))
  }, "Invoice List"))))), /*#__PURE__*/_react.default.createElement(_material.Box, {
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
      const pmRef = (0, _firestore.doc)(firestoreInstance, 'users/' + auth.currentUser.uid + '/paymentMethods/' + pm.id);
      (0, _firestore.setDoc)(pmRef, {
        type: pm.type,
        cardBrand: pm.card.brand,
        cardExpMonth: pm.card.exp_month,
        cardExpYear: pm.card.exp_year,
        cardLast4: pm.card.last4
      }, {
        merge: true
      }).then(() => {
        // attach the payment method to a subscription via cloud function
        const updateSubscriptionPaymentMethod = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-updateSubscriptionPaymentMethod');
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
      const updateSubscriptionPaymentMethod = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-updateSubscriptionPaymentMethod');
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
      const removePaymentMethod = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-removePaymentMethod');
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