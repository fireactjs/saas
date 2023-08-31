"use strict";

require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PermissionRouter = void 0;
var _react = _interopRequireWildcard(require("react"));
var _SubscriptionContext = require("./SubscriptionContext");
var _utilities = require("./utilities");
var _reactRouterDom = require("react-router-dom");
var _material = require("@mui/material");
var _core = require("@fireactjs/core");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const PermissionRouter = _ref => {
  let {
    permissions
  } = _ref;
  const {
    subscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const {
    authInstance
  } = (0, _react.useContext)(_core.AuthContext);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, (0, _utilities.checkPermission)(subscription, authInstance.currentUser.uid, permissions) ? /*#__PURE__*/_react.default.createElement(_reactRouterDom.Outlet, null) : /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, "No premission to access."));
};
exports.PermissionRouter = PermissionRouter;