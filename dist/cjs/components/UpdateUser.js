"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateUser = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _SubscriptionContext = require("./SubscriptionContext");
require("firebase/compat/functions");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _firestore = require("firebase/firestore");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const UpdateUser = _ref => {
  let {
    user,
    setSelectedUser,
    setUsers
  } = _ref;
  const {
    subscription,
    setSubscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const subscriptionName = subscription.name ? subscription.name : "";
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const permissions = config.saas.permissions || {};
  const [processing, setProcessing] = (0, _react.useState)(false);
  const {
    firestoreInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const [userPermissions, setUserPermissions] = (0, _react.useState)(user.permissions);
  const [error, setError] = (0, _react.useState)(null);
  const [success, setSuccess] = (0, _react.useState)(false);
  return /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "md"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Update User" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Update User")), error !== null && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)), success && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "success"
  }, "The user record has been successfully updated")), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    fullWidth: true
  }, /*#__PURE__*/_react.default.createElement(_material.FormLabel, null, "Name"), user.displayName))), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    fullWidth: true
  }, /*#__PURE__*/_react.default.createElement(_material.FormLabel, null, "Email"), user.email)))), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.FormControl, {
    fullWidth: true
  }, /*#__PURE__*/_react.default.createElement(_material.FormLabel, null, "Permissions"), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true
  }, Object.keys(permissions).map((key, index) => {
    return /*#__PURE__*/_react.default.createElement(_material.Grid, {
      item: true,
      xs: 12,
      md: 3,
      key: index
    }, /*#__PURE__*/_react.default.createElement(_material.FormControlLabel, {
      control: /*#__PURE__*/_react.default.createElement(_material.Checkbox, {
        onChange: e => {
          if (e.target.checked) {
            setUserPermissions(prevState => [...prevState, key]);
          } else {
            setUserPermissions(current => current.filter(p => p !== key));
          }
        },
        defaultChecked: user.permissions.indexOf(key) >= 0 ? true : false,
        disabled: permissions[key].default ? true : false
      }),
      label: permissions[key].label ? permissions[key].label : key
    }));
  }))))), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: true
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    color: "secondary",
    variant: "outlined",
    disabled: processing,
    onClick: () => setSelectedUser(null)
  }, "Back")), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    style: {
      marginRight: '10px'
    },
    color: "primary",
    variant: "contained",
    disabled: processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      setSuccess(false);
      const docRef = (0, _firestore.doc)(firestoreInstance, "subscriptions", subscription.id);
      // remove the user from all permissions
      const subPermissions = subscription.permissions;
      for (let p in subPermissions) {
        subPermissions[p] = subPermissions[p].filter(uid => uid !== user.id);
      }
      // assign the user to the selected permissions
      userPermissions.forEach(p => {
        subPermissions[p] = subPermissions[p] || [];
        subPermissions[p].push(user.id);
      });
      (0, _firestore.setDoc)(docRef, {
        permissions: subPermissions
      }, {
        merge: true
      }).then(() => {
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          permissions: subPermissions
        }));
        setUsers(prevState => prevState.map(row => {
          if (row.id === user.id) {
            return _objectSpread(_objectSpread({}, row), {}, {
              permissions: userPermissions
            });
          }
          ;
          return row;
        }));
        setSuccess(true);
        setProcessing(false);
      }).catch(error => {
        setError(error.message);
        setProcessing(false);
      });
    }
  }, "Save"), /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    color: "error",
    variant: "contained",
    disabled: processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      setSuccess(false);
      const docRef = (0, _firestore.doc)(firestoreInstance, "subscriptions", subscription.id);
      // remove the user from all permissions
      const subPermissions = subscription.permissions;
      for (let p in subPermissions) {
        subPermissions[p] = subPermissions[p].filter(uid => uid !== user.id);
      }
      (0, _firestore.setDoc)(docRef, {
        permissions: subPermissions
      }, {
        merge: true
      }).then(() => {
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          permissions: subPermissions
        }));
        setUsers(prevState => prevState.filter(row => {
          return row.id !== user.id;
        }));
        setSelectedUser(null);
      }).catch(error => {
        setError(error.message);
        setProcessing(false);
      });
    }
  }, "Revoke Access"))))));
};
exports.UpdateUser = UpdateUser;