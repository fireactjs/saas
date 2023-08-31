import React from 'react';
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
export const PaginationTable = _ref => {
  let {
    columns,
    rows,
    totalRows,
    pageSize,
    page,
    handlePageChane,
    handlePageSizeChange
  } = _ref;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableContainer, {
    component: Paper
  }, /*#__PURE__*/React.createElement(Table, {
    "aria-label": "simple table"
  }, /*#__PURE__*/React.createElement(TableHead, null, /*#__PURE__*/React.createElement(TableRow, null, columns.map((c, i) => /*#__PURE__*/React.createElement(TableCell, {
    key: i,
    style: c.style
  }, /*#__PURE__*/React.createElement("strong", null, c.name))))), /*#__PURE__*/React.createElement(TableBody, null, rows.map((r, i) => /*#__PURE__*/React.createElement(TableRow, {
    key: i
  }, columns.map((c, k) => /*#__PURE__*/React.createElement(TableCell, {
    key: k
  }, r[c.field]))))))), /*#__PURE__*/React.createElement(TablePagination, {
    rowsPerPageOptions: [10, 20, 50, 100],
    component: "div",
    count: totalRows,
    rowsPerPage: pageSize,
    page: page,
    onPageChange: handlePageChane,
    onRowsPerPageChange: handlePageSizeChange
  }));
};