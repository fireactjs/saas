function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.string.trim.js";
import "core-js/modules/es.symbol.description.js";
import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { Alert, Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import { AuthContext, SetPageTitle } from "@fireactjs/core";
import { FireactContext } from "@fireactjs/core";
import { doc, setDoc } from 'firebase/firestore';
export const Settings = () => {
  const {
    subscription,
    setSubscription
  } = useContext(SubscriptionContext);
  const defaultName = subscription.name ? subscription.name : "";
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);
  const {
    config
  } = useContext(FireactContext);
  const label = config.saas.subscription.singular.substr(0, 1).toUpperCase() + config.saas.subscription.singular.substr(1);
  const {
    firestoreInstance
  } = useContext(AuthContext);
  const [subscriptionName, setSubscriptionName] = useState(defaultName);
  const updateSubscription = () => {
    setProcessing(true);
    setError(null);
    setSuccess(null);
    const docRef = doc(firestoreInstance, "subscriptions", subscription.id);
    if (subscriptionName.trim() !== "") {
      setDoc(docRef, {
        name: subscriptionName
      }, {
        merge: true
      }).then(() => {
        setSuccess('The settings have been successfully updated.');
        setProcessing(false);
        setSubscription(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          name: subscriptionName
        }));
      }).catch(error => {
        setError(error.message);
        setProcessing(false);
      });
    } else {
      setError(label + " is a required field.");
      setProcessing(false);
    }
  };
  return /*#__PURE__*/React.createElement(Container, {
    maxWidth: "md"
  }, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: "Settings" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Settings")), error !== null && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error)), success !== null && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "success"
  }, success)), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(TextField, {
    required: true,
    fullWidth: true,
    name: "title",
    label: label,
    type: "text",
    margin: "normal",
    defaultValue: subscription.name,
    onChange: e => setSubscriptionName(e.target.value)
  })), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    xs: true
  }), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    color: "primary",
    variant: "contained",
    disabled: processing,
    onClick: () => updateSubscription()
  }, "Save"))))));
};