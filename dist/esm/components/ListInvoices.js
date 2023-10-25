import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.number.to-fixed.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.replace.js";
import React, { useContext, useEffect, useState } from "react";
import "firebase/compat/firestore";
import { AuthContext, FireactContext } from "@fireactjs/core";
import { SubscriptionContext } from "./SubscriptionContext";
import { Alert, Button, Grid, Paper, Box, Container, Typography, Stack } from "@mui/material";
import currencies from "./currencies.json";
import { PaginationTable } from "./PaginationTable";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
export const ListInvoices = _ref => {
  let {
    loader
  } = _ref;
  const [loaded, setLoaded] = useState(false);
  const {
    subscription
  } = useContext(SubscriptionContext);
  const {
    firestoreInstance
  } = useContext(AuthContext);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const {
    config
  } = useContext(FireactContext);
  const auth = getAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setError(null);
    setLoaded(false);
    const invoicesRef = collection(firestoreInstance, 'subscriptions/' + subscription.id + "/invoices");
    const q = query(invoicesRef, orderBy('created', 'desc'));
    getDocs(q).then(invoicesSnapshot => {
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
          'amountCol': /*#__PURE__*/React.createElement(React.Fragment, null, currencies[invoice.data().currency].sign, (invoice.data().total / 100).toFixed(2)),
          'statusCol': /*#__PURE__*/React.createElement(React.Fragment, null, invoice.data().status.toUpperCase()),
          'urlCol': invoice.data().hostedInvoiceUrl ? /*#__PURE__*/React.createElement(Button, {
            href: invoice.data().hostedInvoiceUrl,
            rel: "noreferrer",
            target: "_blank",
            variant: "contained",
            size: "small"
          }, "View Invoice") : /*#__PURE__*/React.createElement(React.Fragment, null)
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
  useEffect(() => {
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, loaded ? /*#__PURE__*/React.createElement(Container, {
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
  }, "Invoice List")), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    textAlign: "right"
  }, subscription.ownerId === auth.currentUser.uid && /*#__PURE__*/React.createElement(Stack, {
    direction: "row-reverse",
    spacing: 1,
    mt: 2
  }, /*#__PURE__*/React.createElement(Button, {
    color: "error",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.CancelSubscription.replace(":subscriptionId", subscription.id))
  }, "Cancel Subscription"), /*#__PURE__*/React.createElement(Button, {
    color: "info",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ChangePlan.replace(":subscriptionId", subscription.id))
  }, "Chane Plan"), /*#__PURE__*/React.createElement(Button, {
    color: "info",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.ManagePaymentMethods.replace(":subscriptionId", subscription.id))
  }, "Update Payment Method"), /*#__PURE__*/React.createElement(Button, {
    color: "info",
    variant: "outlined",
    size: "small",
    onClick: () => navigate(config.pathnames.UpdateBillingDetails.replace(":subscriptionId", subscription.id))
  }, "Update Billing Details"))))), /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(PaginationTable, {
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
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, loader));
};