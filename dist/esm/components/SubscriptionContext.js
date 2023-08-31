import "core-js/modules/web.dom-collections.iterator.js";
import React, { useContext, useEffect, useState } from "react";
import { useParams, Outlet } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { AuthContext, FireactContext } from "@fireactjs/core";
import { Alert, Box, Container } from "@mui/material";
export const SubscriptionContext = /*#__PURE__*/React.createContext();
export const SubscriptionProvider = _ref => {
  let {
    loader
  } = _ref;
  const {
    subscriptionId
  } = useParams();
  const [subscription, setSubscription] = useState(null);
  const {
    firestoreInstance
  } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const {
    config
  } = useContext(FireactContext);
  useEffect(() => {
    setError(null);
    const docRef = doc(firestoreInstance, "subscriptions", subscriptionId);
    getDoc(docRef).then(docSnap => {
      if (docSnap.exists()) {
        const sub = docSnap.data();
        sub.id = subscriptionId;
        setSubscription(sub);
      } else {
        // no subscription
        setError("No " + config.saas.subscription.singular + " matches the ID");
      }
    }).catch(error => {
      setError(error.message);
    });
  }, [subscriptionId, firestoreInstance, config.saas.subscription.singular, setError]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, error !== null ? /*#__PURE__*/React.createElement(Box, {
    mt: 10
  }, /*#__PURE__*/React.createElement(Container, {
    maxWidth: "sm"
  }, /*#__PURE__*/React.createElement(Box, {
    component: "span",
    m: 5,
    textAlign: "center"
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error)))) : /*#__PURE__*/React.createElement(React.Fragment, null, subscription !== null ? /*#__PURE__*/React.createElement(SubscriptionContext.Provider, {
    value: {
      subscription,
      setSubscription
    }
  }, /*#__PURE__*/React.createElement(Outlet, null)) : /*#__PURE__*/React.createElement(Box, {
    mt: 10
  }, /*#__PURE__*/React.createElement(Container, {
    maxWidth: "sm"
  }, /*#__PURE__*/React.createElement(Box, {
    component: "span",
    m: 5,
    textAlign: "center"
  }, loader)))));
};