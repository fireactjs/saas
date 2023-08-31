import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.replace.js";
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { AuthContext, FireactContext } from "@fireactjs/core";
import { checkPermission } from "./utilities";
import { SubscriptionContext } from "./SubscriptionContext";
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
export const SubscriptionMenu = _ref => {
  let {
    customItems
  } = _ref;
  const {
    config
  } = useContext(FireactContext);
  const pathnames = config.pathnames;
  const {
    subscription
  } = useContext(SubscriptionContext);
  const {
    authInstance
  } = useContext(AuthContext);
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
  return /*#__PURE__*/React.createElement(List, {
    component: "nav"
  }, checkPermission(subscription, authInstance.currentUser.uid, defaultPermissions) && /*#__PURE__*/React.createElement(NavLink, {
    to: pathnames.Subscription.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "dashboard"
  }, /*#__PURE__*/React.createElement(ListItemButton, null, /*#__PURE__*/React.createElement(ListItemIcon, null, /*#__PURE__*/React.createElement(DashboardIcon, null)), /*#__PURE__*/React.createElement(ListItemText, {
    primary: /*#__PURE__*/React.createElement(Typography, {
      color: "textPrimary"
    }, "Dashboard")
  }))), customItems, checkPermission(subscription, authInstance.currentUser.uid, adminPermissions) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, {
    key: "settings-divider"
  }), /*#__PURE__*/React.createElement(NavLink, {
    to: pathnames.Settings.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "settings"
  }, /*#__PURE__*/React.createElement(ListItemButton, null, /*#__PURE__*/React.createElement(ListItemIcon, null, /*#__PURE__*/React.createElement(SettingsApplicationsIcon, null)), /*#__PURE__*/React.createElement(ListItemText, {
    primary: /*#__PURE__*/React.createElement(Typography, {
      color: "textPrimary"
    }, "Settings")
  }))), /*#__PURE__*/React.createElement(Divider, {
    key: "user-divider"
  }), /*#__PURE__*/React.createElement(NavLink, {
    to: pathnames.ListUsers.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "users"
  }, /*#__PURE__*/React.createElement(ListItemButton, null, /*#__PURE__*/React.createElement(ListItemIcon, null, /*#__PURE__*/React.createElement(PeopleIcon, null)), /*#__PURE__*/React.createElement(ListItemText, {
    primary: /*#__PURE__*/React.createElement(Typography, {
      color: "textPrimary"
    }, "Users")
  }))), /*#__PURE__*/React.createElement(Divider, {
    key: "billing-divider"
  }), /*#__PURE__*/React.createElement(NavLink, {
    to: pathnames.ListInvoices.replace(":subscriptionId", subscription.id),
    style: {
      textDecoration: 'none'
    },
    key: "billing"
  }, /*#__PURE__*/React.createElement(ListItemButton, null, /*#__PURE__*/React.createElement(ListItemIcon, null, /*#__PURE__*/React.createElement(MonetizationOnIcon, null)), /*#__PURE__*/React.createElement(ListItemText, {
    primary: /*#__PURE__*/React.createElement(Typography, {
      color: "textPrimary"
    }, "Billing")
  })))));
};