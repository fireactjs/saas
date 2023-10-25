import "core-js/modules/web.dom-collections.iterator.js";
import "core-js/modules/es.promise.js";
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import React, { useContext, useMemo, useState } from "react";
import { FireactContext } from '@fireactjs/core';
import { Grid, Stack, Alert, Box, Button } from '@mui/material';
const PaymentMethodFormHandler = _ref => {
  let {
    setPaymentMethod,
    buttonText,
    disabled
  } = _ref;
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    },
    hidePostalCode: true
  };
  const getPaymentMethod = async event => {
    event.preventDefault();
    setProcessing(true);
    setError(null);
    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    var data = {
      type: 'card',
      card: cardElement
    };
    const {
      error,
      paymentMethod
    } = await stripe.createPaymentMethod(data);
    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      setPaymentMethod(paymentMethod);
      setProcessing(false);
    }
  };
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
  }, error && /*#__PURE__*/React.createElement(Box, {
    mb: 2
  }, /*#__PURE__*/React.createElement(Alert, {
    severity: "error"
  }, error)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      minHeight: '56px',
      padding: '15px'
    }
  }, /*#__PURE__*/React.createElement(CardElement, {
    options: CARD_ELEMENT_OPTIONS
  }), /*#__PURE__*/React.createElement("fieldset", {
    style: {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '4px',
      position: 'absolute',
      top: '-5px',
      left: '0',
      right: '0',
      bottom: '0',
      margin: '0',
      padding: '0 8px',
      overflow: 'hidden',
      pointerEvents: 'none'
    }
  })))), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "row",
    justifyContent: "center",
    alignItems: "center"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "contained",
    disabled: processing || disabled,
    onClick: e => getPaymentMethod(e)
  }, buttonText)));
};
export const PaymentMethodForm = _ref2 => {
  let {
    setPaymentMethod,
    buttonText,
    disabled,
    billingDetails
  } = _ref2;
  const {
    config
  } = useContext(FireactContext);
  const stripePromise = useMemo(() => {
    return loadStripe(config.saas.stripe.public_api_key);
  }, [config.saas.stripe.public_api_key]);
  return /*#__PURE__*/React.createElement(Elements, {
    stripe: stripePromise
  }, /*#__PURE__*/React.createElement(PaymentMethodFormHandler, {
    setPaymentMethod: setPaymentMethod,
    buttonText: buttonText,
    disabled: disabled,
    billingDetails: billingDetails
  }));
};