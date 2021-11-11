---
title: "Installation"
permalink: /docs/installation/
excerpt: "How to quickly install and setup Fireact."
last_modified_at: 2021-06-07
---

This document will walk you through the steps to install Fireact in your local machine and deploy Fireact to your Firebase project.

## Prerequisites

To run Fireact, you will need accounts on the following platforms:
- [Firebase](https://firebase.google.com/)
- [Stripe](https://stripe.com/)
- [Mailgun](https://www.mailgun.com/)

Fireact is designed to be hosted with Firebase Hosting. It uses Firebase Authenication for the sign-on feature and it stores the data in the Firestore database. It also requires Firebase Cloud Functions to execute server side logic.

Stripe is integrated in Fireact to manage the subscriptions and payments.

Mailgun is integrated to deliver emails that is not available in the Firebase Authentication feature, such as invitation emails from a user to other users.

## Setup React Web Application

### 1. Setup Firebase

Because the solution uses Firebase for authentication, hosting and data storage. You will need to create a Firebase project if you don't have a project already.

You will also need to create a hosting in the Firebase project to host your Fireact application.

### 2. Create Firebase Configuration File for React

After you created a project, go to your [Firebase console](https://console.firebase.google.com/), click on your project, and go to the project settings page. Add a web app to your project, and you will see the settings in a JSON object `firebaseConfig` in the Firebase SDK snippet.

Copy the settings to create a file in the repo as `/src/inc/firebase.json` following the format below:

```
{
    "config":{
        "apiKey": "...",
        "authDomain": "...",
        "databaseURL": "...",
        "projectId": "...",
        "storageBucket": "...",
        "messagingSenderId": "...",
        "appId": "..."
    }
}
```
This file will allow your React UI to interact with Firebase.

### 3. Enable Sign-in Methods

By default, the web application UI allows signing in with email address, Google account and Facebook account. You need to enable these sign-in methods in your Firebase project so that the sign-in functionality will work.

### 4. Setup Firebase Database Rules

The solution stores user data in Firestore database. To secure the data so that only users with permission are able to access and interact with the data, copy and paste the database rules in `/firebase.rules` to your Firebase database rules.

### 5. Setup Stripe

You will need a Stripe account to process subscription payments. After you create a Stripe account, retrieve your public api key and create the configuration file as `/src/inc/stripe.json` in the following format:

```
{
    "stripeConfig": {
        "public_api_key":"..."
    }
}
```
For more detailed instructions on how to retrieve your Stripe keys, please see [https://stripe.com/docs/keys](https://stripe.com/docs/keys)

### 6. Install Dependencies

Run the following command to install the JavaScript packages the solution requires.

```
npm install
```

## Setup Cloud Function Backend

### 1. Create Config File

A configuration file is required to instruct the cloud functions to work. You can extend this file for custom configuration settings you need for your application. By default, it contains two settings: the salt for hashing data and the invitation expiration time in hours.

Create a file `/functions/config.json` in the following format:

```
{
    "salt": "...",
    "invite_expire": 5
}
```

`salt` should be random string. It will be used in hashing data. You can use [this tool](https://www.random.org/strings/) to generate your random salt.

`invite_expire` is an integer number to specify the expiration time of the invites.

### 2. Create Stripe Config File

A configuration file is required to allow the cloud functions to connect to Stripe APIs securely.

Create a file `/functions/stripe.json` in the following format:

```
{
    "public_api_key":"pk_...",
    "secret_api_key": "sk_...",
    "currency": "usd",
    "endpoint_secret": "whsec_..."
}
```

For more detailed instructions on how to retrieve your Stripe keys, please see [https://stripe.com/docs/keys](https://stripe.com/docs/keys)

### 3. Create Mailgun Config File

A configuration file is required to allow cloud functions to send out invitation emails via mailgun.

Create a file `/functions/mailgun.json` in the following format:

```
{
    "api_key": "...",
    "domain": "...",
    "site_name": "Fireact",
    "from": "...",
    "invite_url": "http://localhost:3000/invite"
}
```

For more details on how to get your Mailgun API key, please see [https://help.mailgun.com/hc/en-us/articles/203380100-Where-Can-I-Find-My-API-Key-and-SMTP-Credentials-](https://help.mailgun.com/hc/en-us/articles/203380100-Where-Can-I-Find-My-API-Key-and-SMTP-Credentials-)


## Create Plans

Login to your Stripe account and setup subscription products, including the free plan if you offer freemium. Once the plans are created, copy the price IDs of the products.

Now, you will need to create the plans in Firestore so that users can subscribe to the Stripe products in Fireact.

Create a new collection called "plans" in Firestore, then create new documents mapping to the Stripe products. Below is the JSON object of an example plan in Firestore:

```
{
    "currency":"usd",
    "features": [
        "feature 1",
        "feature 2",
        "feature 3"
    ],
    "name":"Pro"
    "paymentCycle":"mo"
    "price":89.99
    stripePriceId: "price_..."
}
```

## Create Tax Rates (Optional)

If you need to charge sales tax, VAT or GST, you can create tax rates based on the selected country and state on the subscription.

First, you will need to create tax rates in your Stripe account via the console UI or API. For more details, please see [https://stripe.com/docs/billing/taxes/tax-rates](https://stripe.com/docs/billing/taxes/tax-rates).

Once you created the tax rates in Stripe, copy the tax rate IDs from Stripe to create the tax rates in your Firestore database.

Create a new collection called "taxes" in Firestore, and use the Stripe tax rate ID as the document ID for each tax rate document in Firestore.

Below is the JSON object of the Australia GST tax rate in Firestore:

```
{
    "applicable": [
        "AU"
    ],
    "rate": 10
}
```

Below is the JSON object of the California Sales Tax rate in Firestore:

```
{
    "applicable": [
        "US:CA"
    ],
    "rate": 7.25
}
```

Each tax can be applied to multiple countries or states. For country wide tax, put in the 2-character country code in the `applicable` array. For state specific tax, put in the 2-character country code and state code with a colon as separator in the `applicable` array.

You can find all the available country code and state code in the `/src/inc/country.json` file.


## Create Stripe Webhook

When payments are processed or subscription status are changed, Stripe will send the data to Fireact via Webhook. The Fireact webhook location is `https://firebse-location-project-id.cloudfunctions.net/stripeWebHook`

You will need to get your domain name from your Firebase project. The above URL is just an example.

When you create the webhook in Stripe, add the following events to the webhook:

```
customer.subscription.updated
customer.subscription.trial_will_end
customer.subscription.pending_update_expired
customer.subscription.pending_update_applied
customer.subscription.deleted
customer.subscription.created
invoice.created
invoice.deleted
invoice.finalized
invoice.marked_uncollectible
invoice.paid
invoice.payment_action_required
invoice.payment_failed
invoice.payment_succeeded
invoice.sent
invoice.upcoming
invoice.updated
invoice.voided
```

## Deploy to Firebase Hosting

Now, everything is ready, you can deploy your Firebase project with the following commands:

`firebase deploy`

Please note that Firebase assumes the folder is `public` but `npm run build` builds the application in the folder `build`. So when you initialise Firebase hosting in command line, you should change the folder from `public` to `build` otherwise you will see a blank page only as [issue #2](https://github.com/chaoming/fireact/issues/2).

For more details on how to deploy Firebase, please see [https://firebase.google.com/docs/hosting/test-preview-deploy](https://firebase.google.com/docs/hosting/test-preview-deploy)