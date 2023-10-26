import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.array.sort.js";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SubscriptionContext } from "./SubscriptionContext";
import { httpsCallable } from "firebase/functions";
import { AuthContext, FireactContext, SetPageTitle } from "@fireactjs/core";
import { Paper, Box, Container, Grid, Button, Avatar, Alert, Typography } from "@mui/material";
import { PaginationTable } from "./PaginationTable";
import { UpdateUser } from "./UpdateUser";
import { AddUser } from "./AddUser";
export const ListUsers = _ref => {
  let {
    loader
  } = _ref;
  const {
    config
  } = useContext(FireactContext);
  const pathnames = config.pathnames;
  const {
    subscription
  } = useContext(SubscriptionContext);
  const subscriptionName = subscription.name ? subscription.name : "";
  const [users, setUsers] = useState([]);
  const {
    functionsInstance
  } = useContext(AuthContext);
  const [loaded, setLoaded] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addUserActive, setAddUserActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const reovkeInvite = useCallback(_ref2 => {
    let {
      inviteId,
      subscriptionId
    } = _ref2;
    setProcessing(true);
    const revokeInvite = httpsCallable(functionsInstance, 'fireactjsSaas-revokeInvite');
    revokeInvite({
      subscriptionId: subscriptionId,
      inviteId: inviteId
    }).then(res => {
      setUsers(prevState => prevState.filter(row => {
        return row.id !== inviteId && row.type === 'invite' || row.type === 'user';
      }));
      setProcessing(false);
    });
  }, [functionsInstance]);
  useEffect(() => {
    setError(null);
    const getSubscriptionUsers = httpsCallable(functionsInstance, 'fireactjsSaas-getSubscriptionUsers');
    getSubscriptionUsers({
      subscriptionId: subscription.id
    }).then(result => {
      setTotal(result.data.total);
      result.data.users.sort((a, b) => a.displayName > b.displayName);
      setUsers(result.data.users);
      setLoaded(true);
    }).catch(error => {
      setError(error.message);
      setLoaded(true);
    });
  }, [subscription.id, functionsInstance, pathnames.UpdateUser]);
  useEffect(() => {
    const userPermissionLabels = userPermissions => {
      const labels = [];
      userPermissions.forEach(permission => {
        labels.push(config.saas.permissions[permission].label ? config.saas.permissions[permission].label : permission);
      });
      return labels.join(', ');
    };
    const startIndex = page * pageSize;
    let records = [];
    for (let i = startIndex; i < users.length; i++) {
      const user = users[i];
      if (i >= startIndex + pageSize) {
        break;
      }
      if (user.type === 'user') {
        user.nameCol = /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap'
          }
        }, /*#__PURE__*/React.createElement(Avatar, {
          alt: user.displayName,
          src: user.photoURL
        }), /*#__PURE__*/React.createElement("strong", {
          style: {
            marginLeft: '15px'
          }
        }, user.displayName));
        user.permissionCol = userPermissionLabels(user.permissions);
        if (subscription.ownerId === user.id) {
          user.permissionCol = 'Owner';
        }
        user.emailCol = user.email;
        if (subscription.ownerId !== user.id) {
          user.actionCol = /*#__PURE__*/React.createElement(Button, {
            size: "small",
            variant: "outlined",
            disabled: processing,
            onClick: () => setSelectedUser({
              id: user.id,
              email: user.email,
              displayName: user.displayName,
              permissions: user.permissions
            })
          }, "Update");
        }
      }
      if (user.type === 'invite') {
        user.nameCol = /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap'
          }
        }, /*#__PURE__*/React.createElement(Avatar, {
          alt: user.displayName,
          src: user.photoURL
        }), /*#__PURE__*/React.createElement("strong", {
          style: {
            marginLeft: '15px'
          }
        }, user.displayName));
        user.permissionCol = userPermissionLabels(user.permissions);
        user.emailCol = user.email;
        user.actionCol = /*#__PURE__*/React.createElement(Button, {
          size: "small",
          variant: "outlined",
          disabled: processing,
          onClick: e => {
            reovkeInvite({
              inviteId: user.id,
              subscriptionId: subscription.id
            });
          }
        }, "Revoke Invite");
      }
      records.push(user);
    }
    if (records.length > 0) {
      setRows(records);
    }
    if (addUserActive === false && selectedUser === null) {
      window.scrollTo(0, 0);
    }
  }, [page, pageSize, users, addUserActive, selectedUser, reovkeInvite, subscription.ownerId, subscription.id, processing, config.saas.permissions]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetPageTitle, {
    title: "User List" + (subscriptionName !== "" ? " - " + subscriptionName : "")
  }), loaded ? /*#__PURE__*/React.createElement(React.Fragment, null, selectedUser !== null ? /*#__PURE__*/React.createElement(UpdateUser, {
    user: selectedUser,
    setSelectedUser: setSelectedUser,
    setUsers: setUsers
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, addUserActive ? /*#__PURE__*/React.createElement(AddUser, {
    setAddUserActive: setAddUserActive,
    setUsers: setUsers
  }) : /*#__PURE__*/React.createElement(Container, {
    maxWidth: "lx"
  }, error !== null ? /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error) : /*#__PURE__*/React.createElement(Paper, null, /*#__PURE__*/React.createElement(Box, {
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
  }, "User List")), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    textAlign: "right"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "contained",
    onClick: () => setAddUserActive(true)
  }, "Invite User")))), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(PaginationTable, {
    columns: [{
      name: "Name",
      field: "nameCol",
      style: {
        width: '30%'
      }
    }, {
      name: "Email",
      field: "emailCol",
      style: {
        width: '35%'
      }
    }, {
      name: "Permissions",
      field: "permissionCol",
      style: {
        width: '20%'
      }
    }, {
      name: "Action",
      field: "actionCol",
      style: {
        width: '15%'
      }
    }],
    rows: rows,
    totalRows: total,
    pageSize: pageSize,
    page: page,
    handlePageChane: (e, p) => {
      setPage(p);
    },
    handlePageSizeChange: e => {
      setPage(0);
      setPageSize(e.target.value);
    }
  })))))) : /*#__PURE__*/React.createElement(React.Fragment, null, loader));
};