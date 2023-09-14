# What is @fireactjs/saas

fireactjs-saas is the extension package for building SaaS web applications with Firebase, Reactjs and Stripe in a simple and fast approach. It is based on the `@fireactjs/core` package for the user authentication features. Its key features on top of the `@fireactjs/core` package are:

- Built-in Stripe subscription integration
- User permission control on the subscription account level
- Template base design for easy customization
- Component base architecture that supports full customization
- Easy to extend additional features

## Live demo

To experience the package, go to [https://saas-demo.fireactjs.com](https://saas-demo.fireactjs.com)

## Documentation

For documentation of the package, go to [https://fireactjs.com/docs/saas-package/](https://fireactjs.com/docs/saas-package/)

## Installation

Instructions for installing Fireactjs SaaS packages and creating your Reactjs SaaS application with the Fireactjs packages.

## Create Reactjs App with Fireactjs Core

Before installing the Fireactjs SaaS packages, you must set up your Reactjs application with the Fireactjs Core package for user authentication. Read [Fireactjs Installation Guide](https://fireactjs.com/docs/core-package/installation/).

## Install from NPM

The Fireactjs SaaS project comes with two packages: `@fireacjts/saas` for the Reactjs front-end and `@fireactjs/saas-cloud-functions` for the server-side Firebase Cloud Functions.

In your Reactjs app root folder, use the following command to install the `@fireactjs/saas` package:

```
npm i @fireactjs/saas
```

In your `/functions` folder where your Firebase Cloud Functions are located, use the following command to install the `@fireactjs/saas-cloud-functions` package:

```
npm i @fireactjs/saas-cloud-functions
```

## Setup Payment Plans

Fireactjs SaaS integrates with [Stripe](https://www.stripe.com) to handle subscription payments. You must have a Stripe account to enable the integration.

In Stripe, create products for your SaaS. Each product can have multiple prices. However, these prices must have the same billing period.

Create a JSON to describe your plans as the example below. Each plan must have an unique `id` to identify the plan. A plan can contain multiple price IDs from different products in Stripe. In this example, the "enterprise" plan contains two prices which are from two products: license and support.

If the `free` property is set to `true` for a plan, the plan will not ask for putting in a credit card. Make sure that all the prices in the plan are "0" in price in Stripe.

If a plan is no longer available for new users, set its `legacy` property to `true` and the plan will not be shown in the pricing table.

```json
[
    {
        "id": "free",
        "title": "Free",
        "popular": false,
        "priceIds": [
            "price_1..."
        ],
        "currency": "$",
        "price": 0,
        "frequency": "week",
        "description": [
            "10 users included",
            "2 GB of storage",
            "Help center access",
            "Email support"
        ],
        "free": true,
        "legacy": false
    },
    {
        "id": "pro",
        "title": "Pro",
        "popular": true,
        "priceIds": [
            "price_2..."
        ],
        "currency": "$",
        "price": 10,
        "frequency": "week",
        "description": [
            "20 users included",
            "10 GB of storage",
            "Help center access",
            "Priority email support"
        ],
        "free": false,
        "legacy": false
    },
    {
        "id": "enterprise",
        "title": "Enterprise",
        "popular": false,
        "priceIds": [
            "price_3...",
            "price_4..."
        ],
        "currency": "$",
        "price": 30,
        "frequency": "week",
        "description": [
            "50 users included",
            "30 GB of storage",
            "Help center access",
            "Phone & email support"
        ],
        "free": false,
        "legacy": false
    },
    {
        "id": "legcy",
        "title": "Gold",
        "popular": true,
        "priceIds": [
            "price_2..."
        ],
        "currency": "$",
        "price": 10,
        "frequency": "week",
        "description": [
            "20 users included",
            "10 GB of storage",
            "Help center access",
            "Priority email support"
        ],
        "free": false,
        "legacy": true
    }
]
```

## Setup Stripe Integration

For the cloud functions to receive data from Stripe, you will need to create a webhook endpoint with the cloud function webhook URL `https://firebse-location-project-id.cloudfunctions.net/fireactjsSaas-stripeWebHook`. Please make sure you replace the domain with your actual Firebase project cloud function domain. Once the webhook is created, you will get an endpoint secret which is needed in the configuration file.

The following Stripe events need to be sent to the endpoint:

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
invoice.updated
invoice.voided
```

## Create `/src/config.json` File

Create a file called `config.json` in the `/src` folder as the example shows below store the configuration settings.

To integrate with Stripe, the Stripe public API key is required for the `stripe.pubblic_api_key` property.

The Reactjs application needs the `price_id` from Stripe to integrate with the Stripe payment plans. The plans will be shown in the pricing table as the property values in the JSON `plans`. It’s important that the `priceId` property value of each plan matches the plan’s `price_id` in Stripe.

```json
{
    "stripe": {
        "public_api_key": "pk_test_..."
    },
    "plans": [
        {
            "id": "free",
            "title": "Free",
            "popular": false,
            "priceIds": [
                "price_1..."
            ],
            "currency": "$",
            "price": 0,
            "frequency": "week",
            "description": [
                "10 users included",
                "2 GB of storage",
                "Help center access",
                "Email support"
            ],
            "free": true,
            "legacy": false
        },
        {
            "id": "pro",
            "title": "Pro",
            "popular": true,
            "priceIds": [
                "price_2..."
            ],
            "currency": "$",
            "price": 10,
            "frequency": "week",
            "description": [
                "20 users included",
                "10 GB of storage",
                "Help center access",
                "Priority email support"
            ],
            "free": false,
            "legacy": false
        },
        {
            "id": "enterprise",
            "title": "Enterprise",
            "popular": false,
            "priceIds": [
                "price_3...",
                "price_4..."
            ],
            "currency": "$",
            "price": 30,
            "frequency": "week",
            "description": [
                "50 users included",
                "30 GB of storage",
                "Help center access",
                "Phone & email support"
            ],
            "free": false,
            "legacy": false
        },
        {
            "id": "legcy",
            "title": "Gold",
            "popular": true,
            "priceIds": [
                "price_2..."
            ],
            "currency": "$",
            "price": 10,
            "frequency": "week",
            "description": [
                "20 users included",
                "10 GB of storage",
                "Help center access",
                "Priority email support"
            ],
            "free": false,
            "legacy": true
        }
    ],
    "permissions": {
        "access": {
            "default": true,
            "admin": false
        },
        "admin": {
            "default": false,
            "admin": true
        }
    },
    "subscription": {
        "singular": "project",
        "plural": "projects"
    }
}
```

## Create `/functions/config.json` File

In the `/functions` folder, create a `config.json` file as the example shows below.

You will need to put in the stripe secret API key and the endpoint secret in the configuration file to integrate the cloud functions with Stripe.

Plans are also needed for the cloud functions similar to the Reactjs application.

For sending new user invites, the `mailgun` JSON is needed. The details are covered in the next section.

```json
{
    "brand": "My Brand",
    "site_name": "My SaaS App",
    "site_url": "https://app.mydomain.com",
    "sign_in_url": "https://app.mydomain.com/sign-in",
    "sign_up_url": "https://app.mydomain.com/sign-up",
    "stripe": {
        "secret_api_key": "sk_test_...",
        "end_point_secret": "whsec_..."
    },
    "plans": [
        {
            "id": "free",
            "title": "Free",
            "popular": false,
            "priceIds": [
                "price_1..."
            ],
            "currency": "$",
            "price": 0,
            "frequency": "week",
            "description": [
                "10 users included",
                "2 GB of storage",
                "Help center access",
                "Email support"
            ],
            "free": true,
            "legacy": false
        },
        {
            "id": "pro",
            "title": "Pro",
            "popular": true,
            "priceIds": [
                "price_2..."
            ],
            "currency": "$",
            "price": 10,
            "frequency": "week",
            "description": [
                "20 users included",
                "10 GB of storage",
                "Help center access",
                "Priority email support"
            ],
            "free": false,
            "legacy": false
        },
        {
            "id": "enterprise",
            "title": "Enterprise",
            "popular": false,
            "priceIds": [
                "price_3...",
                "price_4..."
            ],
            "currency": "$",
            "price": 30,
            "frequency": "week",
            "description": [
                "50 users included",
                "30 GB of storage",
                "Help center access",
                "Phone & email support"
            ],
            "free": false,
            "legacy": false
        },
        {
            "id": "legcy",
            "title": "Gold",
            "popular": true,
            "priceIds": [
                "price_2..."
            ],
            "currency": "$",
            "price": 10,
            "frequency": "week",
            "description": [
                "20 users included",
                "10 GB of storage",
                "Help center access",
                "Priority email support"
            ],
            "free": false,
            "legacy": true
        }
    ],
    "permissions": {
        "access": {
            "default": true,
            "admin": false
        },
        "admin": {
            "default": false,
            "admin": true
        }
    },
    "mailgun": {
        "api_key": "...",
        "domain": "app.mydomain.com",
        "from": "No Reply <no-reply@app.mydomain.com>",
        "templates":{
            "invite_email": "invite"
        }
    }
}
```

## Setup Mailgun Integration (optional)

The framework integrates with Mailgun to send invite emails when users are invited to join subscription accounts. To setup the integration, retrieve the API key from Mailgun and create a file called `mailgun.json` under the `src` folder as the example below shows.

```json
{
    "api_key": "...",
    "domain": "app.mydomain.com",
    "from": "No Reply <no-reply@app.mydomain.com>",
    "templates":{
        "invite_email": "invite"
}
```

In Mailgun, you will need a template for the invite emails. Create a template called `invite` with the subject line below.

```
{{sender}} invited you to {{site_name}}
```

In the template body, use the following copy.

```
Hi {{name}},

You received this invite because {{sender}} invited you to join {{site_name}}. Please sign in ({{sign_in_url}}) to accept the invite.

If you don't have a user account yet, please sign up ({{sign_up_url}}) here.

Best regards,

The {{site_name}} team
```

The invite template supports the following variables:

- {{sender}} - the name of the person who sends the invite
- {{site_name}} - the name of your web application defined in the cloud function configurations
- {{name}} - the name of the new user who is invited by the sender
- {{sign_in_url}} - the URL to the sign-in page which is defined in the cloud function configurations
- {{sign_up_url}} - the URL to the sign-up page which is defined in the cloud function configurations

Note: The invite email is optional for the invite process. You can skip this step but the new users will need to be informed by other methods so that they know where to sign up and sign in to accept the invites.

## Update Firestore Rules

The SaaS package uses Firestore database to store and manage the subscription data. To secure the data, the following Firestore rules need to be added to your Firestore database rules.

```
match /users/{userId}/paymentMethods/{paymentMethodId} {
    allow read, update, create, delete: if request.auth.uid == userId;
}
match /subscriptions/{subscriptionId} {
    allow read: if request.auth.uid != null && request.auth.uid in resource.data.permissions.access;
    allow update: if request.auth.uid != null && request.auth.uid in resource.data.permissions.admin && (!request.resource.data.diff(resource.data).affectedKeys()
        .hasAny(['currency', 'ownerId', 'paymentCycle', 'paymentMethod', 'plan', 'price', 'stripeItems', 'stripeSubscriptionId', 'subscriptionCreated', 'subscriptionCurrentPeriodEnd', 'subscriptionCurrentPeriodStart', 'subscriptionEnded', 'subscriptionStatus']));
}
match /subscriptions/{subscriptionId}/invoices/{invoiceId} {
    allow read: if request.auth.uid != null && request.auth.uid in get(/databases/$(database)/documents/subscriptions/$(subscriptionId)).data.permissions.admin;
}
match /invites/{inviteId} {
    allow read, delete: if request.auth.uid != null && request.auth.token.email == resource.data.email;
}
```

## Modify `/src/App.js`

Replace the code in your `src/App.js` with the code below.

```jsx
import './App.css';
import firebaseConfig from "./firebaseConfig.json";
import { pathnames, AppTemplate, AuthProvider, AuthRoutes, MainMenu, PublicTemplate, ResetPassword, SignIn, SignUp, UserMenu, UserProfile, UserUpdateEmail, UserUpdateName, UserUpdatePassword, UserDelete, FireactProvider, ActionPages } from '@fireactjs/core';
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { CircularProgress, Box } from '@mui/material';
import authMethods from "./authMethods.json";
import { CreateSubscription, ListSubscriptions, pathnames as subPathnames, PermissionRouter, Settings, SubscriptionMenu, ListUsers, SubscriptionProvider, ListInvoices, ManagePaymentMethods, ChangePlan, CancelSubscription } from '@fireactjs/saas';
import SaaSConfig from './config.json';

const Brand = "FIREACT";

const Logo = ({size, color}) => {
	const logoColor = color || 'warning';
	return (
		<LocalFireDepartmentIcon color={logoColor} fontSize={size} />
	);
}

const Loader = ({size}) => {
	let cpSize = "35px";
	switch(size){
		case "small":
			cpSize = "30px";
			break;
		case "medium":
			cpSize = "35px";
			break;
		case "large":
			cpSize = "45px";
			break;
		default:
			cpSize = "35px";
			break;
	}
	return (
		<Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center"}}>
			<CircularProgress color="warning" size={cpSize} />
			<div style={{position: "absolute" }}>
				<Logo size={size} />
			</div>
		</Box>
	);
}

function App() {

	// merge pathnames
	for(var key in subPathnames){
		pathnames[key] = subPathnames[key];
	}

	const config = {
		firebaseConfig: firebaseConfig,
		brand: "FIREACTJS",
		pathnames: pathnames,
		authProviders: authMethods,
		saas: SaaSConfig
	}

	return (
		<FireactProvider config={config}>
			<AuthProvider firebaseConfig={firebaseConfig} brand={Brand}>
				<BrowserRouter>
					<Routes>
						<Route element={<AuthRoutes loader={<Loader size="large" />} />} >
							<Route element={<AppTemplate logo={<Logo size="large" />} toolBarMenu={<UserMenu />} drawerMenu={<MainMenu />} />}>
								<Route exact path={pathnames.ListSubscriptions} element={<ListSubscriptions loader={<Loader size="large" />} />} />
								<Route exact path={pathnames.CreateSubscription} element={<CreateSubscription />} />
								<Route exact path={pathnames.UserProfile} element={<UserProfile />} />
								<Route exact path={pathnames.UserUpdateEmail} element={<UserUpdateEmail />} />
								<Route exact path={pathnames.UserUpdateName} element={<UserUpdateName />} />
								<Route exact path={pathnames.UserUpdatePassword} element={<UserUpdatePassword />} />
								<Route exact path={pathnames.UserDelete} element={<UserDelete />} />
							</Route>
							
							<Route path={pathnames.Subscription} element={<SubscriptionProvider loader={<Loader size="large" />} />} >
								<Route element={<AppTemplate logo={<Logo size="large" />} toolBarMenu={<UserMenu />} drawerMenu={<SubscriptionMenu />} />}>
									<Route element={<PermissionRouter permissions={["access"]} />} >
										<Route exact path={pathnames.Subscription+"/"} element={<div>Home</div>} />
									</Route>
									<Route element={<PermissionRouter permissions={["admin"]} />} >
										<Route exact path={pathnames.Settings} element={<Settings loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ListUsers} element={<ListUsers loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ListInvoices} element={<ListInvoices loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ManagePaymentMethods} element={<ManagePaymentMethods loader={<Loader size="large" />} />} />
										<Route exact path={pathnames.ChangePlan} element={<ChangePlan />} />
										<Route exact path={pathnames.CancelSubscription} element={<CancelSubscription />} />
									</Route>
								</Route>
							</Route>
						</Route>
						<Route element={<PublicTemplate />}>
							<Route path={pathnames.SignIn} element={
								<SignIn
									logo={<Logo size="large" />}
								/>
							} />
							<Route path={pathnames.SignUp} element={
								<SignUp
									logo={<Logo size="large" />}
								/>
							} />
							<Route path={pathnames.ResetPassword} element={
								<ResetPassword
									logo={<Logo size="large" />}
								/>
							} />
							<Route path={pathnames.ActionPages} element={
								<ActionPages
									logo={<Logo size="large" />}
								/>
							} />
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</FireactProvider>
	)
}

export default App;
```

## Modify `/functions/index.js`

Replace the code in your `/functions/index.js` with the following code.

```javascript
const admin = require('firebase-admin');
admin.initializeApp();
const config = require('./config.json');
let fireactjsSaasFunctions =  require('@fireactjs/saas-cloud-functions')(config);
exports.fireactjsSaas = fireactjsSaasFunctions;
```

## Run your app locally

By now, your app is ready for the first run locally. Use the command `npm start` to start the app.

## Deploy to Firebase

After testing locally, your app is ready to be deployed to Firebase hosting.

### Build

Run `npm run build` to build your app

### Deploy

Run `firebase deploy` to deploy your app to Firebase. If you see a blank screen in your production URL, make sure you set the `build` as the folder in your Firebase settings.