import React, { useContext } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { checkPermission } from "./utilities";
import { Outlet } from 'react-router-dom';
import { Alert } from "@mui/material";
import { AuthContext } from "@fireactjs/core";
export const PermissionRouter = _ref => {
  let {
    permissions
  } = _ref;
  const {
    subscription
  } = useContext(SubscriptionContext);
  const {
    authInstance
  } = useContext(AuthContext);
  return /*#__PURE__*/React.createElement(React.Fragment, null, checkPermission(subscription, authInstance.currentUser.uid, permissions) ? /*#__PURE__*/React.createElement(Outlet, null) : /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, "No premission to access."));
};