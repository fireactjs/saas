"use strict";

require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubscriptionMenu = void 0;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _material = require("@mui/material");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _Dashboard = _interopRequireDefault(require("@mui/icons-material/Dashboard"));
var _People = _interopRequireDefault(require("@mui/icons-material/People"));
var _MonetizationOn = _interopRequireDefault(require("@mui/icons-material/MonetizationOn"));
var _core = require("@fireactjs/core");
var _utilities = require("./utilities");
var _SubscriptionContext = require("./SubscriptionContext");
var _auth = require("firebase/auth");
var _SettingsApplications = _interopRequireDefault(require("@mui/icons-material/SettingsApplications"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const SubscriptionMenu = _ref => {
  let {
    customItems
  } = _ref;
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const pathnames = config.pathnames;
  const {
    subscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const auth = (0, _auth.getAuth)();
  const defaultPermissions = [];
  const adminPermissions = [];
  for (let permission in config.saas.permissions) {
    if (config.saas.permissions[permission].default) {
      defaultPermissions.push(permission);
    }
    if (config.saas.permissions[permission].admin) {
      adminPermissions.push(permission);
    }
  }
  return /*#__PURE__*/_react.default.createElement(_material.List, {
    component: "nav"
  }, (0, _utilities.checkPermission)(subscription, auth.currentUser.uid, defaultPermissions) && /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: pathnames.Subscription.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "dashboard"
  }, /*#__PURE__*/_react.default.createElement(_material.ListItemButton, null, /*#__PURE__*/_react.default.createElement(_material.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(_Dashboard.default, null)), /*#__PURE__*/_react.default.createElement(_material.ListItemText, {
    primary: /*#__PURE__*/_react.default.createElement(_material.Typography, {
      color: "textPrimary"
    }, "Dashboard")
  }))), customItems, (0, _utilities.checkPermission)(subscription, auth.currentUser.uid, adminPermissions) && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_material.Divider, {
    key: "settings-divider"
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: pathnames.Settings.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "settings"
  }, /*#__PURE__*/_react.default.createElement(_material.ListItemButton, null, /*#__PURE__*/_react.default.createElement(_material.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(_SettingsApplications.default, null)), /*#__PURE__*/_react.default.createElement(_material.ListItemText, {
    primary: /*#__PURE__*/_react.default.createElement(_material.Typography, {
      color: "textPrimary"
    }, "Settings")
  }))), /*#__PURE__*/_react.default.createElement(_material.Divider, {
    key: "user-divider"
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: pathnames.ListUsers.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "users"
  }, /*#__PURE__*/_react.default.createElement(_material.ListItemButton, null, /*#__PURE__*/_react.default.createElement(_material.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(_People.default, null)), /*#__PURE__*/_react.default.createElement(_material.ListItemText, {
    primary: /*#__PURE__*/_react.default.createElement(_material.Typography, {
      color: "textPrimary"
    }, "Users")
  }))), /*#__PURE__*/_react.default.createElement(_material.Divider, {
    key: "billing-divider"
  }), /*#__PURE__*/_react.default.createElement(_reactRouterDom.NavLink, {
    to: pathnames.ListInvoices.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "billing"
  }, /*#__PURE__*/_react.default.createElement(_material.ListItemButton, null, /*#__PURE__*/_react.default.createElement(_material.ListItemIcon, null, /*#__PURE__*/_react.default.createElement(_MonetizationOn.default, null)), /*#__PURE__*/_react.default.createElement(_material.ListItemText, {
    primary: /*#__PURE__*/_react.default.createElement(_material.Typography, {
      color: "textPrimary"
    }, "Billing")
  })))));
};
exports.SubscriptionMenu = SubscriptionMenu;