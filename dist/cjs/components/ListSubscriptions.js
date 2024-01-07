"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListSubscriptions = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _core = require("@fireactjs/core");
var _material = require("@mui/material");
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _functions = require("firebase/functions");
var _system = require("@mui/system");
var _firestore = require("firebase/firestore");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ListSubscriptions = _ref => {
  let {
    loader
  } = _ref;
  const {
    authInstance,
    firestoreInstance,
    functionsInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const navigate = (0, _reactRouterDom.useNavigate)();
  const [subscriptions, setSubscriptions] = (0, _react.useState)([]);
  const [loaded, setLoaded] = (0, _react.useState)(false);
  const [error, setError] = (0, _react.useState)(null);
  const [invites, setInvites] = (0, _react.useState)([]);
  const [processing, setProcessing] = (0, _react.useState)(false);
  const [acceptedInviteCount, setAcceptedInviteCount] = (0, _react.useState)(0);
  (0, _react.useEffect)(() => {
    setLoaded(false);
    setError(null);
    // get default permission level name
    let defaultPermission = '';
    for (var permission in config.saas.permissions) {
      const value = config.saas.permissions[permission];
      if (value.default) {
        defaultPermission = permission;
      }
    }
    let subscriptions = [];
    let invites = [];

    //const subscriptionsRef = firebaseApp.firestore().collection('subscriptions');
    const subscriptionsRef = (0, _firestore.collection)(firestoreInstance, '/subscriptions');
    //const subQuery = subscriptionsRef.where('permissions.'+defaultPermission, 'array-contains', firebaseApp.auth().currentUser.uid);
    const subQuery = (0, _firestore.query)(subscriptionsRef, (0, _firestore.where)('permissions.' + defaultPermission, 'array-contains', authInstance.currentUser.uid));
    //const invitesRef = firebaseApp.firestore().collection('invites');
    const invitesRef = (0, _firestore.collection)(firestoreInstance, '/invites');
    //const inviteQuery = invitesRef.where('email', '==', firebaseApp.auth().currentUser.email);
    const inviteQuery = (0, _firestore.query)(invitesRef, (0, _firestore.where)('email', '==', authInstance.currentUser.email));
    Promise.all([(0, _firestore.getDocs)(subQuery), (0, _firestore.getDocs)(inviteQuery)]).then(_ref2 => {
      let [subSnapshot, inSnapshot] = _ref2;
      subSnapshot.forEach(record => {
        subscriptions.push({
          id: record.id,
          name: record.data().name
        });
      });
      inSnapshot.forEach(record => {
        invites.push({
          id: record.id,
          sender: record.data().sender,
          subscriptionName: record.data().subscriptionName || "Untitled"
        });
      });
      setSubscriptions(subscriptions);
      setInvites(invites);
      setLoaded(true);
    }).catch(error => {
      setLoaded(true);
      setError(error.message);
    });
  }, [authInstance, config.saas.permissions, acceptedInviteCount, firestoreInstance]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loaded ? /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "lx"
  }, /*#__PURE__*/_react.default.createElement(_core.SetPageTitle, {
    title: "My Subscriptions"
  }), /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }, /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, /*#__PURE__*/_react.default.createElement(_material.Typography, {
    component: "h1",
    variant: "h4"
  }, "My ", config.saas.subscription.plural)), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    textAlign: "right"
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "contained",
    onClick: () => navigate(config.pathnames.CreateSubscription)
  }, "Add ", config.saas.subscription.singular)))), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, error !== null ? /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, invites.length > 0 && authInstance.currentUser.emailVerified && /*#__PURE__*/_react.default.createElement(_system.Stack, {
    spacing: 2,
    mb: 2
  }, invites.map((invite, i) => /*#__PURE__*/_react.default.createElement(_material.Alert, {
    key: i,
    severity: "info",
    action: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_material.Button, {
      color: "success",
      disabled: processing,
      size: "small",
      onClick: () => {
        setProcessing(true);
        const acceptInvite = (0, _functions.httpsCallable)(functionsInstance, 'fireactjsSaas-acceptInvite');
        acceptInvite({
          inviteId: invite.id
        }).then(() => {
          setProcessing(false);
          setAcceptedInviteCount(prevState => prevState + 1);
        }).catch(error => {
          // something went wrong
          setProcessing(false);
        });
      }
    }, "Accept"), /*#__PURE__*/_react.default.createElement(_material.Button, {
      color: "warning",
      disabled: processing,
      size: "small",
      onClick: () => {
        setProcessing(true);
        const docRef = (0, _firestore.doc)(firestoreInstance, 'invites/' + invite.id);
        const inviteRef = (0, _firestore.getDoc)(docRef);
        inviteRef.delete().then(() => {
          setInvites(prevState => prevState.filter(row => {
            return row.id !== invite.id;
          }));
          setProcessing(false);
        }).catch(error => {
          // something went wrong
          setProcessing(false);
        });
      }
    }, "Reject"))
  }, "You are invited to join ", /*#__PURE__*/_react.default.createElement("strong", null, invite.subscriptionName), " by ", /*#__PURE__*/_react.default.createElement("strong", null, invite.sender)))), invites.length > 0 && !authInstance.currentUser.emailVerified && /*#__PURE__*/_react.default.createElement(_system.Stack, {
    spacing: 2,
    mb: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "warning",
    action: /*#__PURE__*/_react.default.createElement(_material.Button, {
      size: "small",
      onClick: () => navigate(config.pathnames.UserProfile)
    }, "My Profile")
  }, "You have invites but your email is not verified. Please go to your profile and verify your email to accept the invites.")), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    container: true,
    spacing: 3
  }, subscriptions.length > 0 ? subscriptions.map((subscription, i) => /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    xs: 12,
    md: 4,
    key: i
  }, /*#__PURE__*/_react.default.createElement(_material.Card, null, /*#__PURE__*/_react.default.createElement(_material.CardHeader, {
    title: subscription.name ? subscription.name : "Untitled",
    subheader: subscription.id
  }), /*#__PURE__*/_react.default.createElement(_material.CardActions, null, /*#__PURE__*/_react.default.createElement(_material.Button, {
    variant: "outlined",
    color: "success",
    onClick: () => {
      navigate(config.pathnames.Subscription.replace(":subscriptionId", subscription.id));
    }
  }, "Access"))))) : /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true
  }, "You don't have access to any ", config.saas.subscription.singular, ". Please create one or ask your admin to invite you to one.")))))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loader));
};
exports.ListSubscriptions = ListSubscriptions;