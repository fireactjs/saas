---
title: "Currency"
permalink: /docs/currency/
excerpt: "Configure currency in Fireact"
last_modified_at: 2021-11-02
---

The default currency in the Fireact repository is USD. Fireact supports the currencies that Stripe supports. Please see the Stripe supported currencies here: [https://stripe.com/docs/currencies](https://stripe.com/docs/currencies)

The currency code is required in four locations:
- Stripe price object
- Firestore plan documents
- /functions/stripe.json
- /src/inc/currency.json

## Stripe Price Object

When creating a new price for a product in Stripe, ensure that currency for the payment is selected correctly.

![Stripe pricing settings](/assets/images/stripe-pricing.png)

## Firestore Plan Documents

When creating a plan document in the Firestore database, ensure the currency code is the same as the Stripe price object.

For details about creating a plan document in Firestore, please refer to [https://fireact.dev/docs/installation/#create-plans](https://fireact.dev/docs/installation/#create-plans)

## /functions/stripe.json

In the Cloud Function stripe setting file `/functions/stripe.json`, ensure the `currency` property value is the currency code used in Stripe.

## /src/inc/currency.json

In the `currency.json` file, ensure the currency code is presented as `currency.{currencyCode}` and it’s the same code used in Stripe.

To change the currency, the currency codes in above four locations must be updated.