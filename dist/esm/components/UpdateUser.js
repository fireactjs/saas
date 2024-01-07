function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.description.js";
import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import "firebase/compat/functions";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Paper, Box, Container, Grid, Button, Alert, Typography, FormControl, FormLabel, FormControlLabel, Checkbox } from "@mui/material";
import { doc, setDoc } from 'firebase/firestore';
export const UpdateUser = _ref => {
  let {
    user,
    setSelectedUser,
    setUsers
  } = _ref;
  const {
    subscription,
    setSubscription
  } = useContext(SubscriptionContext);
  const subscriptionName = subscription.name ? subscription.name : "";
  const {
    config
  } = useContext(FireactContext);
  const permissions = config.saas.permissions || {};
  const [processing, setProcessing] = useState(false);
  const {
    firestoreInstance
  } = useContext(AuthContext);
  const [userPermissions, setUserPermissions] = useState(user.permissions);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  return /*#__PURE__*/React.createElement(Container, {
    maxWidth: "md"
  }, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: "Update User" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Update User")), error !== null && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error)), success && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "success"
  }, "The user record has been successfully updated")), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(FormControl, {
    fullWidth: true
  }, /*#__PURE__*/React.createElement(FormLabel, null, "Name"), user.displayName))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: 12,
    md: 6
  }, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(FormControl, {
    fullWidth: true
  }, /*#__PURE__*/React.createElement(FormLabel, null, "Email"), user.email)))), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(FormControl, {
    fullWidth: true
  }, /*#__PURE__*/React.createElement(FormLabel, null, "Permissions"), /*#__PURE__*/React.createElement(Grid, {
    container: true
  }, Object.keys(permissions).map((key, index) => {
    return /*#__PURE__*/React.createElement(Grid, {
      item: true,
      xs: 12,
      md: 3,
      key: index
    }, /*#__PURE__*/React.createElement(FormControlLabel, {
      control: /*#__PURE__*/React.createElement(Checkbox, {
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
  }))))), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: true
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    color: "secondary",
    variant: "outlined",
    disabled: processing,
    onClick: () => setSelectedUser(null)
  }, "Back")), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
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
      const docRef = doc(firestoreInstance, "subscriptions", subscription.id);
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
      setDoc(docRef, {
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
  }, "Save"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    color: "error",
    variant: "contained",
    disabled: processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      setSuccess(false);
      const docRef = doc(firestoreInstance, "subscriptions", subscription.id);
      // remove the user from all permissions
      const subPermissions = subscription.permissions;
      for (let p in subPermissions) {
        subPermissions[p] = subPermissions[p].filter(uid => uid !== user.id);
      }
      setDoc(docRef, {
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