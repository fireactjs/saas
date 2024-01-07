"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListInvoices = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.number.to-fixed.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
var _react = _interopRequireWildcard(require("react"));
require("firebase/compat/firestore");
var _core = require("@fireactjs/core");
var _SubscriptionContext = require("./SubscriptionContext");
var _material = require("@mui/material");
var _currencies = _interopRequireDefault(require("./currencies.json"));
var _PaginationTable = require("./PaginationTable");
var _auth = require("firebase/auth");
var _reactRouterDom = require("react-router-dom");
var _firestore2 = require("firebase/firestore");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ListInvoices = _ref => {
  let {
    loader
  } = _ref;
  const [loaded, setLoaded] = (0, _react.useState)(false);
  const {
    subscription
  } = (0, _react.useContext)(_SubscriptionContext.SubscriptionContext);
  const {
    firestoreInstance
  } = (0, _react.useContext)(_core.AuthContext);
  const [invoices, setInvoices] = (0, _react.useState)([]);
  const [error, setError] = (0, _react.useState)(null);
  const [total, setTotal] = (0, _react.useState)(0);
  const [page, setPage] = (0, _react.useState)(0);
  const [pageSize, setPageSize] = (0, _react.useState)(10);
  const [rows, setRows] = (0, _react.useState)([]);
  const {
    config
  } = (0, _react.useContext)(_core.FireactContext);
  const auth = (0, _auth.getAuth)();
  const navigate = (0, _reactRouterDom.useNavigate)();
  (0, _react.useEffect)(() => {
    setError(null);
    setLoaded(false);
    const invoicesRef = (0, _firestore2.collection)(firestoreInstance, 'subscriptions/' + subscription.id + "/invoices");
    const q = (0, _firestore2.query)(invoicesRef, (0, _firestore2.orderBy)('created', 'desc'));
    (0, _firestore2.getDocs)(q).then(invoicesSnapshot => {
      const records = [];
      invoicesSnapshot.forEach(invoice => {
        records.push({
          'id': invoice.id,
          'total': (invoice.data().total / 100).toFixed(2),
          'subTotal': (invoice.data().subTotal / 100).toFixed(2),
          'tax': ((invoice.data().tax || 0) / 100).toFixed(2),
          'amountPaid': Math.round(invoice.data().amountPaid / 100).toFixed(2),
          'created': new Date(invoice.data().created * 1000).toLocaleString(),
          'hostedInvoiceUrl': invoice.data().hostedInvoiceUrl,
          'currency': invoice.data().currency,
          'status': invoice.data().status,
          'amountCol': /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, _currencies.default[invoice.data().currency].sign, (invoice.data().total / 100).toFixed(2)),
          'statusCol': /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, invoice.data().status.toUpperCase()),
          'urlCol': invoice.data().hostedInvoiceUrl ? /*#__PURE__*/_react.default.createElement(_material.Button, {
            href: invoice.data().hostedInvoiceUrl,
            rel: "noreferrer",
            target: "_blank",
            variant: "contained",
            size: "small"
          }, "View Invoice") : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null)
        });
      });
      setTotal(records.length);
      setInvoices(records);
      setLoaded(true);
    }).catch(err => {
      setError(err.message);
      setLoaded(true);
    });
  }, [firestoreInstance, subscription.id]);
  (0, _react.useEffect)(() => {
    const startIndex = page * pageSize;
    const rows = [];
    for (let i = startIndex; i < invoices.length; i++) {
      const invoice = invoices[i];
      if (i >= startIndex + pageSize) {
        break;
      }
      rows.push(invoice);
    }
    if (rows.length > 0) {
      setRows(rows);
    }
    window.scrollTo(0, 0);
  }, [page, pageSize, invoices]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loaded ? /*#__PURE__*/_react.default.createElement(_material.Container, {
    maxWidth: "lx"
  }, error !== null ? /*#__PURE__*/_react.default.createElement(_material.Alert, {
    severity: "error"
  }, error) : /*#__PURE__*/_react.default.createElement(_material.Paper, null, /*#__PURE__*/_react.default.createElement(_material.Box, {
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
  }, "Invoice List")), /*#__PURE__*/_react.default.createElement(_material.Grid, {
    item: true,
    textAlign: "right"
  }, subscription.ownerId === auth.currentUser.uid && /*#__PURE__*/_react.default.createElement(_material.Stack, {
    direction: "row-reverse",
    spacing: 1,
    mt: 2
  }, /*#__PURE__*/_react.default.createElement(_material.Button, {
    color: "error",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.CancelSubscription.replace(":subscriptionId", subscription.id))
  }, "Cancel Subscription"), /*#__PURE__*/_react.default.createElement(_material.Button, {
    color: "info",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ChangePlan.replace(":subscriptionId", subscription.id))
  }, "Chane Plan"), /*#__PURE__*/_react.default.createElement(_material.Button, {
    color: "info",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ManagePaymentMethods.replace(":subscriptionId", subscription.id))
  }, "Update Payment Method"), /*#__PURE__*/_react.default.createElement(_material.Button, {
    color: "info",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.UpdateBillingDetails.replace(":subscriptionId", subscription.id))
  }, "Update Billing Details"))))), /*#__PURE__*/_react.default.createElement(_material.Box, {
    p: 2
  }, /*#__PURE__*/_react.default.createElement(_PaginationTable.PaginationTable, {
    columns: [{
      name: "Invoice ID",
      field: "id",
      style: {
        width: '30%'
      }
    }, {
      name: "Amount",
      field: "amountCol",
      style: {
        width: '15%'
      }
    }, {
      name: "Status",
      field: "statusCol",
      style: {
        width: '10%'
      }
    }, {
      name: "Invoice Date",
      field: "created",
      style: {
        width: '30%'
      }
    }, {
      name: "Invoice URL",
      field: "urlCol",
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
  })))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, loader));
};
exports.ListInvoices = ListInvoices;