"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateSubscription = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.symbol.description.js");
var _react = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _Star = _interopRequireDefault(require("@mui/icons-material/Star"));
var _core = require("@fireactjs/core");
var _stripeJs = require("@stripe/stripe-js");
var _reactStripeJs = require("@stripe/react-stripe-js");
var _reactRouterDom = require("react-router-dom");
require("firebase/compat/functions");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const PriceTable = _ref => {
  let {
    setPlan,
    plans
  } = _ref;
  const {
    firebaseApp
  } = (0, _react.useContext)(_core.AuthContext);
  const CloudFunctions = firebaseApp.functions();
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const navigate = (0, _reactRouterDom.useNavigate)();
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const singular = config.saas.subscription.singular;
  const subscribe = async (event, plan) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);
    if (plan.price === 0) {
      const createSubscription = CloudFunctions.httpsCallable('fireactjsSaas-createSubscription');
      createSubscription({
        priceId: plan.priceId,
        paymentMethodId: null
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
    }
  };
  return /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 5
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true,
    mb: 8
  }, "Choose Your Plan"), error && /*#__PURE__*/_react.default.createElement(_material.Box, {
    mb: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    spacing: 5,
    alignItems: "flex-end"
  }, plans.map(plan =>
  /*#__PURE__*/
  // Enterprise card is full width at sm breakpoint
  _react.default.createElement(_material.Grid, {
    item: true,
    key: plan.title,
    xs: 12,
    sm: plan.title === 'Enterprise' ? 12 : 6,
    md: 4
  }, /*#__PURE__*/_react.default.createElement(_material.Card, null, /*#__PURE__*/_react.default.createElement(_material.CardHeader, {
    title: plan.title,
    subheader: plan.popular ? "Most Popular" : "",
    titleTypographyProps: {
      align: 'center'
    },
    action: plan.popular ? /*#__PURE__*/_react.default.createElement(_Star.default, {
      color: "success"
    }) : null,
    subheaderTypographyProps: {
      align: 'center'
    },
    sx: {
      backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]
    }
  }), /*#__PURE__*/_react.default.createElement(_material.CardContent, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    sx: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      mb: 2
    }
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "h4",
    color: "text.primary"
  }, plan.currency), /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h2",
    variant: "h3",
    color: "text.primary"
  }, plan.price), /*#__PURE__*/_react.default.createElement(_material.Typography, {
    variant: "h6",
    color: "text.secondary"
  }, "/", plan.frequency)), /*#__PURE__*/_react.default.createElement("ul", {
    style: {
      listStyleType: 'none',
      paddingLeft: '0px'
    }
  }, plan.description.map(line => /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "li",
    variant: "subtitle1",
    align: "center",
    key: line
  }, line)))), /*#__PURE__*/_react.default.createElement(_material.CardActions, null, /*#__PURE__*/_react.default.createElement(_material.Button, {
    fullWidth: true,
    disabled: processing,
    variant: plan.popular ? "contained" : "outlined",
    onClick: e => {
      if (plan.price === 0) {
        subscribe(e, plan);
      } else {
        setPlan(plan);
      }
    }
  }, plan.price === 0 ? "Subscribe" : "Continue")))))));
};
const PaymentForm = _ref2 => {
  let {
    plan
  } = _ref2;
  const stripe = (0, _reactStripeJs.useStripe)();
  const elements = (0, _reactStripeJs.useElements)();
  const {
    firebaseApp
  } = (0, _react.useContext)(_core.AuthContext);
  const CloudFunctions = firebaseApp.functions();
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const navigate = (0, _reactRouterDom.useNavigate)();
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const singular = config.saas.subscription.singular;
  const subscribe = async event => {
    event.preventDefault();
    setProcessing(true);
    setError(null);
    if (plan.price > 0) {
      if (!stripe || !elements) {
        return;
      }
      const cardElement = elements.getElement(_reactStripeJs.CardElement);
      const {
        error,
        paymentMethod
      } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });
      if (error) {
        setError(error.message);
        setProcessing(false);
      } else {
        const createSubscription = CloudFunctions.httpsCallable('fireactjsSaas-createSubscription');
        createSubscription({
          priceId: plan.priceId,
          paymentMethodId: paymentMethod.id
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
      }
    }
  };
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
  return /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 5
  }, /*#__PURE__*/_react.default.createElement(_material.Stack, {
    spacing: 3
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h3",
    align: "center",
    color: "text.primary",
    gutterBottom: true,
    mb: 8
  }, "Payment Method"), /*#__PURE__*/_react.default.createElement(_material.Grid, {
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
    disabled: processing,
    onClick: e => subscribe(e)
  }, "Subscribe"))));
};
const CreateSubscription = () => {
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const [plan, setPlan] = (0, _react.useState)(null);
  const stripePromise = (0, _stripeJs.loadStripe)(config.saas.stripe.public_api_key);
  const singular = config.saas.subscription.singular;
  return /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "lg"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Create ".concat(singular)
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, plan === null && /*#__PURE__*/_react.default.createElement(PriceTable, {
    setPlan: setPlan,
    plans: config.saas.plans
  }), plan !== null && /*#__PURE__*/_react.default.createElement(_reactStripeJs.Elements, {
    stripe: stripePromise
  }, /*#__PURE__*/_react.default.createElement(PaymentForm, {
    plan: plan
  }))));
};
exports.CreateSubscription = CreateSubscription;