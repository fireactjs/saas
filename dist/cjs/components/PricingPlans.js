"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PricingPlans = void 0;
require("core-js/modules/es.symbol.description.js");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _system = require("@mui/system");
var _react = _interopRequireWildcard(require("react"));
var _Star = _interopRequireDefault(require("@mui/icons-material/Star"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PricingPlans = _ref => {
  let {
    selectedPlanId,
    disabled,
    selectPlan,
    paymentMethod
  } = _ref;
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const plans = config.saas.plans;
  return /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    spacing: 5,
    alignItems: "flex-end"
  }, plans.map((plan, i) => plan.legacy === false && /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    key: i,
    xs: 12,
    sm: 6,
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
  }), /*#__PURE__*/_react.default.createElement(_material.CardContent, null, /*#__PURE__*/_react.default.createElement(_system.Box, {
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
    disabled: disabled || selectedPlanId === plan.id ? true : false,
    variant: plan.popular ? "contained" : "outlined",
    onClick: e => {
      selectPlan(plan);
    }
  }, plan.free || paymentMethod ? "Subscribe" : "Continue"))))));
};
exports.PricingPlans = PricingPlans;