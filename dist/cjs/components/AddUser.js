"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddUser = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _react = _interopRequireWildcard(require("react"));
var _SubscriptionContext = require("./SubscriptionContext");
var _functions = require("firebase/functions");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//import "firebase/compat/functions";

const AddUser = _ref => {
  let {
    setAddUserActive,
    setUsers
  } = _ref;
  const {
    subscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const subscriptionName = subscription.name ? subscription.name : "";
  const {
    functionsInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const permissions = config.saas.permissions || {};
  const defaultPermissions = [];
  for (let p in permissions) {
    if (permissions[p].default) {
      defaultPermissions.push(p);
    }
  }
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [email, setEmail] = (0, _react.useState)('');
  const [displayName, setDisplayName] = (0, _react.useState)('');
  const [userPermissions, setUserPermissions] = (0, _react.useState)(defaultPermissions);
  const [error, setError] = (0, _react.useState)(null);
  const [success, setSuccess] = (0, _react.useState)(false);
  return /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "md"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "Invite User" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Invite User")), error !== null && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error)), success && /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "success"
  }, "The invite has been successfully sent")), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.TextField, {
    required: true,
    fullWidth: true,
    name: "name",
    label: "Name",
    type: "text",
    margin: "normal",
    onChange: e => {
      setDisplayName(e.target.value);
    }
  }), /*#__PURE__*/_react.default.createElement(_material.TextField, {
    required: true,
    fullWidth: true,
    name: "email",
    label: "Email",
    type: "email",
    margin: "normal",
    onChange: e => {
      setEmail(e.target.value);
    }
  }), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 1
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
        defaultChecked: permissions[key].default ? true : false,
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
    onClick: () => setAddUserActive(false)
  }, "Back")), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    type: "button",
    color: "primary",
    variant: "contained",
    disabled: processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      setSuccess(false);
      const inviteUser = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-inviteUser');
      inviteUser({
        email: email.toLocaleLowerCase(),
        displayName: displayName,
        permissions: userPermissions,
        subscriptionId: subscription.id
      }).then(res => {
        setUsers(prevState => {
          prevState.push({
            displayName: displayName,
            email: email.toLocaleLowerCase(),
            id: res.data.inviteId,
            permissions: userPermissions,
            photoURL: null,
            type: "invite"
          });
          return prevState;
        });
        setProcessing(false);
        setSuccess(true);
      }).catch(error => {
        setError(error.message);
        setProcessing(false);
      });
    }
  }, "Invite"))))));
};
exports.AddUser = AddUser;