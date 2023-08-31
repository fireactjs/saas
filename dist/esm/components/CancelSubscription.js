import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.replace.js";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Paper, Container, Box, Typography, TextField, Button, Grid, Alert } from "@mui/material";
import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
export const CancelSubscription = () => {
  const {
    subscription
  } = useContext(SubscriptionContext);
  const [processing, setProcessing] = useState(false);
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const {
    config
  } = useContext(FireactContext);
  const [error, setError] = useState(null);
  const {
    functionsInstance
  } = useContext(AuthContext);
  return /*#__PURE__*/React.createElement(Container, {
    maxWidth: "md"
  }, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: "Cancel Subscription" + (subscription.name !== "" ? " - " + subscription.name : "")
  }), /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Cancel Subscription")), error !== null && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error)), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "p",
    align: "center",
    size: "small"
  }, "Type in ", /*#__PURE__*/React.createElement("strong", null, subscription.id), " and click the \"Cancel Subscription\" button to confirm the cancellation. This action cannot be undone."), /*#__PURE__*/React.createElement(TextField, {
    required: true,
    fullWidth: true,
    name: "title",
    type: "text",
    margin: "normal",
    onChange: e => setInput(e.target.value)
  })), /*#__PURE__*/React.createElement(Box, {
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
    onClick: () => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))
  }, "Back")), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    color: "error",
    variant: "contained",
    disabled: processing,
    onClick: () => {
      setError(null);
      setProcessing(true);
      if (input !== subscription.id) {
        setError("The input confirmation does not match \"" + subscription.id + "\"");
        setProcessing(false);
      } else {
        const cancelSubscription = httpsCallable(functionsInstance, 'fireactjsSaas-cancelSubscription');
        return cancelSubscription({
          subscriptionId: subscription.id
        }).then(() => {
          // redirect
          navigate(config.pathnames.ListSubscriptions);
        }).catch(error => {
          setError(error.message);
          setProcessing(false);
        });
      }
    }
  }, "Cancel Subscription"))))));
};