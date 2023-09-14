import "core-js/modules/es.symbol.description.js";
import { FireactContext } from "@fireactjs/core";
import { Button, Card, CardActions, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext } from "react";
import StarIcon from '@mui/icons-material/Star';
export const PricingPlans = _ref => {
  let {
    selectedPlanId,
    disabled,
    selectPlan,
    paymentMethod
  } = _ref;
  const {
    config
  } = useContext(FireactContext);
  const plans = config.saas.plans;
  return /*#__PURE__*/React.createElement(Grid, {
    container: true,
    spacing: 5,
    alignItems: "flex-end"
  }, plans.map((plan, i) => plan.legacy === false && /*#__PURE__*/React.createElement(Grid, {
    item: true,
    key: i,
    xs: 12,
    sm: 6,
    md: 4
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    title: plan.title,
    subheader: plan.popular ? "Most Popular" : "",
    titleTypographyProps: {
      align: 'center'
    },
    action: plan.popular ? /*#__PURE__*/React.createElement(StarIcon, {
      color: "success"
    }) : null,
    subheaderTypographyProps: {
      align: 'center'
    },
    sx: {
      backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[700]
    }
  }), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement(Box, {
    sx: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      mb: 2
    }
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h4",
    color: "text.primary"
  }, plan.currency), /*#__PURE__*/React.createElement(Typography, {
    component: "h2",
    variant: "h3",
    color: "text.primary"
  }, plan.price), /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    color: "text.secondary"
  }, "/", plan.frequency)), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyleType: 'none',
      paddingLeft: '0px'
    }
  }, plan.description.map(line => /*#__PURE__*/React.createElement(Typography, {
    component: "li",
    variant: "subtitle1",
    align: "center",
    key: line
  }, line)))), /*#__PURE__*/React.createElement(CardActions, null, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    disabled: disabled || selectedPlanId === plan.id ? true : false,
    variant: plan.popular ? "contained" : "outlined",
    onClick: e => {
      selectPlan(plan);
    }
  }, plan.free || paymentMethod ? "Subscribe" : "Continue"))))));
};