function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.symbol.description.js";
import React, { useEffect, useState } from "react";
import { Grid, Stack, Box, Button, TextField } from '@mui/material';
import { CountryField, StateField, VisitorAPIComponents } from 'react-country-state-fields';
export const BillingDetails = _ref => {
  let {
    setBillingDetailsObject,
    buttonText,
    disabled,
    currentBillingDetails
  } = _ref;
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      postal_code: "",
      state: "",
      stateObj: {},
      country: "",
      countryObj: {}
    }
  });
  useEffect(() => {
    if (currentBillingDetails) {
      setBillingDetails(currentBillingDetails);
    }
  }, [currentBillingDetails]);
  return /*#__PURE__*/React.createElement(Stack, {
    spacing: 3
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "center",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    md: 8
  }, /*#__PURE__*/React.createElement(Box, {
    p: 2
  }, /*#__PURE__*/React.createElement(TextField, {
    fullWidth: true,
    name: "name",
    label: "Business Name",
    type: "text",
    margin: "normal",
    onChange: e => {
      setBillingDetails(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
        name: e.target.value
      }));
    },
    value: billingDetails.name
  }), /*#__PURE__*/React.createElement(TextField, {
    fullWidth: true,
    name: "line1",
    label: "Address Line 1",
    type: "text",
    margin: "normal",
    onChange: e => {
      setBillingDetails(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
        address: _objectSpread(_objectSpread({}, prevState.address), {}, {
          line1: e.target.value
        })
      }));
    },
    value: billingDetails.address.line1
  }), /*#__PURE__*/React.createElement(TextField, {
    fullWidth: true,
    name: "line2",
    label: "Address Line 2",
    type: "text",
    margin: "normal",
    onChange: e => {
      setBillingDetails(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
        address: _objectSpread(_objectSpread({}, prevState.address), {}, {
          line2: e.target.value
        })
      }));
    },
    value: billingDetails.address.line2
  }), /*#__PURE__*/React.createElement(Grid, {
    container: true
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    md: 7
  }, /*#__PURE__*/React.createElement(TextField, {
    fullWidth: true,
    name: "city",
    label: "City / Suburb",
    type: "text",
    margin: "normal",
    onChange: e => {
      setBillingDetails(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
        address: _objectSpread(_objectSpread({}, prevState.address), {}, {
          city: e.target.value
        })
      }));
    },
    value: billingDetails.address.city
  })), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    md: 1
  }), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    md: 4
  }, /*#__PURE__*/React.createElement(TextField, {
    fullWidth: true,
    name: "postal_code",
    label: "Postal Code",
    type: "text",
    margin: "normal",
    onChange: e => {
      setBillingDetails(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
        address: _objectSpread(_objectSpread({}, prevState.address), {}, {
          postal_code: e.target.value
        })
      }));
    },
    value: billingDetails.address.postal_code
  }))), /*#__PURE__*/React.createElement(VisitorAPIComponents, {
    projectId: "",
    handleCountryChange: countryObj => {
      if (countryObj !== null) {
        setBillingDetails(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          address: _objectSpread(_objectSpread({}, prevState.address), {}, {
            countryObj: countryObj,
            country: countryObj && countryObj.code ? countryObj.code : ""
          })
        }));
      }
    },
    handleStateChange: stateObj => {
      if (stateObj !== null) {
        setBillingDetails(prevState => _objectSpread(_objectSpread({}, prevState), {}, {
          address: _objectSpread(_objectSpread({}, prevState.address), {}, {
            stateObj: stateObj,
            state: stateObj && stateObj.label ? stateObj.label : ""
          })
        }));
      }
    },
    defaultCountryCode: billingDetails.address.country,
    defaultStateCode: billingDetails.address.stateObj.code
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true,
    md: 7
  }, /*#__PURE__*/React.createElement(Box, {
    pt: 2,
    pb: 1
  }, /*#__PURE__*/React.createElement(CountryField, {
    label: "Country / Territory",
    value: billingDetails.address.countryObj
  }))), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    md: 1
  }), /*#__PURE__*/React.createElement(Grid, {
    item: true,
    md: 4
  }, /*#__PURE__*/React.createElement(Box, {
    pt: 2,
    pb: 1
  }, /*#__PURE__*/React.createElement(StateField, {
    label: "State / Province",
    fullWidth: true
  })))))))), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "center",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "contained",
    disabled: disabled,
    onClick: e => setBillingDetailsObject(billingDetails)
  }, buttonText)));
};