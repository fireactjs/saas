"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaymentMethodForm = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.js");
var _stripeJs = require("@stripe/stripe-js");
var _reactStripeJs = require("@stripe/react-stripe-js");
var _react = _interopRequireWildcard(require("react"));
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PaymentMethodFormHandler = _ref => {
  let {
    setPaymentMethod,
    buttonText,
    disabled
  } = _ref;
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const stripe = (0, _reactStripeJs.useStripe)();
  const elements = (0, _reactStripeJs.useElements)();
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
    hidePostalCode: true
  };
  const getPaymentMethod = async event => {
    event.preventDefault();
    setProcessing(true);
    setError(null);
    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }
    const cardElement = elements.getElement(_reactStripeJs.CardElement);
    var data = {
      type: 'card',
      card: cardElement
    };
    const {
      error,
      paymentMethod
    } = await stripe.createPaymentMethod(data);
    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      setPaymentMethod(paymentMethod);
      setProcessing(false);
    }
  };
  return /*#__PURE__*/_react.default.createElement(_material.Stack, {
    spacing: 3
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    direction: "row",
    justifyContent: "center",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    md: 8
  }, error && /*#__PURE__*/_react.default.createElement(_material.Box, {
    mb: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: "relative",
      minHeight: '56px',
      padding: '15px'
    }
  }, /*#__PURE__*/_react.default.createElement(_reactStripeJs.CardElement, {
    options: CARD_ELEMENT_OPTIONS
  }), /*#__PURE__*/_react.default.createElement("fieldset", {
    style: {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '4px',
      position: 'absolute',
      top: '-5px',
      left: '0',
      right: '0',
      bottom: '0',
      margin: '0',
      padding: '0 8px',
      overflow: 'hidden',
      pointerEvents: 'none'
    }
  })))), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    direction: "row",
    justifyContent: "center",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "contained",
    disabled: processing || disabled,
    onClick: e => getPaymentMethod(e)
  }, buttonText)));
};
const PaymentMethodForm = _ref2 => {
  let {
    setPaymentMethod,
    buttonText,
    disabled,
    billingDetails
  } = _ref2;
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const stripePromise = (0, _react.useMemo)(() => {
    return (0, _stripeJs.loadStripe)(config.saas.stripe.public_api_key);
  }, [config.saas.stripe.public_api_key]);
  return /*#__PURE__*/_react.default.createElement(_reactStripeJs.Elements, {
    stripe: stripePromise
  }, /*#__PURE__*/_react.default.createElement(PaymentMethodFormHandler, {
    setPaymentMethod: setPaymentMethod,
    buttonText: buttonText,
    disabled: disabled,
    billingDetails: billingDetails
  }));
};
exports.PaymentMethodForm = PaymentMethodForm;