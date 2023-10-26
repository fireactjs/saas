import "core-js/modules/web.dom-collections.iterator.js";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Alert, Box, Button, Checkbox, Container, FormControl, FormControlLabel, FormLabel, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
//import "firebase/compat/functions";
import { httpsCallable } from 'firebase/functions';
export const AddUser = _ref => {
  let {
    setAddUserActive,
    setUsers
  } = _ref;
  const {
    subscription
  } = useContext(SubscriptionContext);
  const subscriptionName = subscription.name ? subscription.name : "";
  const {
    functionsInstance
  } = useContext(AuthContext);
  const {
    config
  } = useContext(FireactContext);
  const permissions = config.saas.permissions || {};
  const defaultPermissions = [];
  for (let p in permissions) {
    if (permissions[p].default) {
      defaultPermissions.push(p);
    }
  }
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userPermissions, setUserPermissions] = useState(defaultPermissions);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  return /*#__PURE__*/React.createElement(Container, {
    maxWidth: "md"
  }, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: "Invite User" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Typography, {
    component: "h1",
    variant: "h4",
    align: "center"
  }, "Invite User")), error !== null && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error)), success && /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "success"
  }, "The invite has been successfully sent")), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(TextField, {
    required: true,
    fullWidth: true,
    name: "name",
    label: "Name",
    type: "text",
    margin: "normal",
    onChange: e => {
      setDisplayName(e.target.value);
    }
  }), /*#__PURE__*/React.createElement(TextField, {
    required: true,
    fullWidth: true,
    name: "email",
    label: "Email",
    type: "email",
    margin: "normal",
    onChange: e => {
      setEmail(e.target.value);
    }
  }), /*#__PURE__*/React.createElement(Box, {
    p: 1
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
        defaultChecked: permissions[key].default ? true : false,
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
    onClick: () => setAddUserActive(false)
  }, "Back")), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    color: "primary",
    variant: "contained",
    disabled: processing,
    onClick: () => {
      setProcessing(true);
      setError(null);
      setSuccess(false);
      const inviteUser = httpsCallable(functionsInstance, 'fireactjsSaas-inviteUser');
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