"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginationTable = void 0;
var _react = _interopRequireDefault(require("react"));
var _material = require("@mui/material");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PaginationTable = _ref => {
  let {
    columns,
    rows,
    totalRows,
    pageSize,
    page,
    handlePageChane,
    handlePageSizeChange
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_material.TableContainer, {
    component: _material.Paper
  }, /*#__PURE__*/_react.default.createElement(_material.Table, {
    "aria-label": "simple table"
  }, /*#__PURE__*/_react.default.createElement(_material.TableHead, null, /*#__PURE__*/_react.default.createElement(_material.TableRow, null, columns.map((c, i) => /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    key: i,
    style: c.style
  }, /*#__PURE__*/_react.default.createElement("strong", null, c.name))))), /*#__PURE__*/_react.default.createElement(_material.TableBody, null, rows.map((r, i) => /*#__PURE__*/_react.default.createElement(_material.TableRow, {
    key: i
  }, columns.map((c, k) => /*#__PURE__*/_react.default.createElement(_material.TableCell, {
    key: k
  }, r[c.field]))))))), /*#__PURE__*/_react.default.createElement(_material.TablePagination, {
    rowsPerPageOptions: [10, 20, 50, 100],
    component: "div",
    count: totalRows,
    rowsPerPage: pageSize,
    page: page,
    onPageChange: handlePageChane,
    onRowsPerPageChange: handlePageSizeChange
  }));
};
exports.PaginationTable = PaginationTable;