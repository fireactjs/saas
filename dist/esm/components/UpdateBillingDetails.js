import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.replace.js";
import { AuthContext, SetPageTitle, FireactContext } from "@fireactjs/core";
import { Alert, Box, Container, Paper, Typography, Grid, Button } from "@mui/material";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { BillingDetails } from "./BillingDetails";
import { SubscriptionContext } from "./SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
export const UpdateBillingDetails = _ref => {
  let {
    loader
  } = _ref;
  const title = "Update Billing Details";
  const {
    subscription
  } = useContext(SubscriptionContext);
  const [loaded, setLoeaded] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const {
    firestoreInstance
  } = useContext(AuthContext);
  const {
    config
  } = useContext(FireactContext);
  const navigate = useNavigate();
  const [billingDetails, setBillingDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succss, setSuccess] = useState(false);
  const {
    functionsInstance
  } = useContext(AuthContext);
  useEffect(() => {
    setLoeaded(false);
    setError(null);
    getDoc(doc(firestoreInstance, 'users/' + auth.currentUser.uid)).then(doc => {
      setBillingDetails(doc.data().billingDetails);
      setLoeaded(true);
    }).catch(err => {
      setError(err.message);
      setLoeaded(true);
    });
  }, [auth.currentUser.uid, firestoreInstance]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, loaded ? /*#__PURE__*/React.createElement(Container, {
    maxWidth: "lx"
  }, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: title
  }), /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h4"
  }, title)), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    textAlign: "right"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ListInvoices.replace(":subscriptionId", subscription.id))
  }, "Invoice List")))), error !== null ? /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error)) : /*#__PURE__*/React.createElement(React.Fragment, null, succss === true && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "success"
  }, "Billing details have been updated successfully.")), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(BillingDetails, {
    disabled: processing,
    buttonText: "Update",
    currentBillingDetails: billingDetails,
    setBillingDetailsObject: obj => {
      setProcessing(true);
      setSuccess(false);
      const changeBillingDetails = httpsCallable(functionsInstance, 'fireactjsSaas-changeBillingDetails');
      changeBillingDetails({
        billingDetails: obj
      }).then(() => {
        setBillingDetails(obj);
        setProcessing(false);
        setSuccess(true);
      }).catch(error => {
        setError(error.message);
        setProcessing(false);
        setSuccess(false);
      });
    }
  }))))) : /*#__PURE__*/React.createElement(React.Fragment, null, loader));
};